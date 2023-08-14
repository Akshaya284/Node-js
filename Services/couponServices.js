const Coupon = require("../Models/couponModel");

async function createCoupon(params, callback) {
    try {
        if (params.couponCode === undefined) {
            console.log(params.couponCode);
            return callback({
                message: "Coupon code Required",
            });
        }

        const existingCoupon = await Coupon.findOne({ couponCode: params.couponCode });
        if (existingCoupon) {
            return callback({
                message: "Coupon code already exists",
            });
        }

        const coupon = new Coupon(params);
        const response = await coupon.save();

        if (params.offerPoster) {
            result.offerPoster = params.offerPoster; // Store the image path in the result
          }

        return callback(null, { ...response.toJSON() });
    } catch (error) {
        return callback(error);
    }
}

async function updateCoupon(couponId, updateData) {
    try {
        const existingCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, { new: true });
        if (!existingCoupon) {
            throw new Error("Coupon not found");
        }

        return existingCoupon.toJSON();
    } catch (error) {
        throw error;
    }
}

async function getCouponById(couponId) {
    try {
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            throw new Error("Coupon not found");
        }
        return coupon.toJSON();
    } catch (error) {
        throw error;
    }
};

async function getCoupons({ sortBy, search }) {
    try {
        const query = {};
        if (search) {
            query.$or = [
                { couponCode: { $regex: search, $options: "i" } },
                { offerName: { $regex: search, $options: "i" } }
            ];
        }

        if (sortBy === "active") {
            query.status = true;
        } else if (sortBy === "inActive") {
            query.status = false;
        }

        const coupons = await Coupon.find(query);
        return coupons.map(coupon => coupon.toJSON());

    } catch (error) {
        throw error;
    }
};


async function deleteCouponById(couponId) {
    try {
        const deletedCoupon = Coupon.findByIdAndDelete(couponId);

        if (!deletedCoupon) {
            throw new Error("Coupon not found")
        }
        return deletedCoupon;
    } catch (error) {
        throw (error);
    }
};

module.exports = {
    createCoupon,
    updateCoupon,
    getCouponById,
    getCoupons,
    deleteCouponById
}