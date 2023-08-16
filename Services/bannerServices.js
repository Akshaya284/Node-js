const Banner = require("../Models/bannerModel");

async function createBanner(params) {
    try {
        const { title, bannerImage, status } = params;

        if (!title) {
            throw new Error("Title is required");
        };
        if (!bannerImage) {
            throw new Error("Banner Image is required");
        };
        if (!status || !["active", "inActive"].includes(status)) {
            throw new Error("Invalid Status")
        };
        const existingBanner = await Banner.findOne({ title: params.title });

        if (existingBanner) {
            throw new Error("Banner already exists.")
        };

        const banner = new Banner(params);
        const response = await banner.save();
        return response.toJSON();
    }
    catch (error) {
        throw (error);
    };
};

async function editBanner(params, updatedFields) {

    try {
        const updatedBanner = await Banner.findByIdAndUpdate(params, updatedFields, { new: true });

        if (!updatedBanner) {
            throw new Error("Banner not found")
        };

        return updatedBanner.toJSON();
    }
    catch (error) {
        throw (error);
    }
}

async function getBannerbyId(bannerId) {
    try {
        const banner = Banner.findById(bannerId);
        if (!banner) {
            throw new Error("Banner not found");
        }
        return banner;
    }
    catch (error) {
        throw (error);
    }
};

async function getBanner(search) {
    try {
        let query = {};
        if (search) {
            query = { bannerTitle: { $regex: search, $options: "i" } };
        }
        const banners = await Banner.find(query);
        return banners.map(banner => banner.toJSON());
    }
    catch (error) {
        throw (error);
    };
};

async function deleteBanner(bannerId) {
    try {
        const banner = await Banner.findByIdAndDelete(bannerId);
        if (!banner) {
            throw new Error("Banner not found")
        }
        return banner;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    createBanner,
    editBanner,
    getBannerbyId,
    getBanner,
    deleteBanner
}