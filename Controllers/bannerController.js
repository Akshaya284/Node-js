const bannerServices = require("../Services/bannerServices");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

let maxSize = 2 * 1000 * 1000;
let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    }
});

exports.createBanner = [
upload.single("bannerImage"),
async (req, res, next) => {
  const {title, status} = req.body;
  const bannerImage = req.file.filename
  const userRole = req.user.role;

  console.log(title, bannerImage, status, "banner");

  if(!title || title.trim === "" || title === null) {
     return res.status(400).json({message :"Title is required"});
  };
  if(!bannerImage) {
    return res.status(400).json({message : "Banner Image is required"});
  };
  if(!status || status === null) {
    return res.status(400).json({message : "Status required."})
  };
  if(userRole !== "admin") {
    return res.status(400).json({message : "Unauthorized. Only admins can create banners."})
  }
  try {
    const result = await bannerServices.createBanner({
    title, 
    bannerImage , 
    status
   });

   return res.status(201).json({message : "Banner created successfully", data : result});
  }
  catch (error) {
   return res.status(500).json({message : "Error creating banner", error : error});
//    throw error;
  };
}];

exports.editBanner = [ 
    upload.single("bannerImage"),
    async (req, res, next) => {
      const bannerId = req.params.id;
      const userRole = req.user.role;

      if (userRole !== "admin") {
        return res.status(401).json({message: "Unauthorized. Only admins can edit banner"});
      }

      try {
        const {title, bannerImage, status} = req.body;
        const updatedFields = {
            title, bannerImage, status
        };
        const result = await bannerServices.editBanner(bannerId, updatedFields);
        res.status(201).json({message : "Banner updated successfully", data : result})
      }
      catch (error) {
        res.status(500).json({message : "Error updating banner", error : error});
        throw(error)
      }
}];

exports.getBannerById = async (req, res, next) => {
    const bannerId = req.params.id;
   try {
    const result = await bannerServices.getBannerbyId(bannerId);
    return res.status(201).json({message : "Banner retrieved successfully", data : result});
   }
   catch (error) {
    return res.status(500).json({message : "Error getting the banner"});
   }
};

exports.getBanner = async (req, res, next) => {
    const {search} = req.query;
    try {
        const banners = await bannerServices.getBanner(search);
        if (banners.length === 0) {
            return res.status(404).json({message : "No banners found"});
        };
        return res.status(201).json({message : "Products retrieved successfully.", data : banners});
    }
    catch (error) {
        return res.status(500).json({message : "Error retreiving the products", error : error});
        
    }
}

exports.deleteBanner = async (req, res, next) => {
    const bannerId = req.params.id;
    const userRole = req.user.role;

      if (userRole !== "admin") {
        return res.status(401).json({message: "Unauthorized. Only admins can delete banner"});
      }
    try {
        const deletedProduct = await bannerServices.deleteBanner(bannerId);
        return res.status(200).json({message : "Banner deleted successfully", data : deletedProduct});
    }
    catch (error) {
        return res.status(500).json({message : "Error deleting banner", error : error});
    };
};