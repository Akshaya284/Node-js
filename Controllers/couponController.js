const couponServices = require("../Services/couponServices");

const multer = require("multer");
const upload = multer({ dest: "uploads/",
fileFilter: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024, // 1MB maximum file size
  },
 });

exports.createCoupon = [
    upload.single("offerPoster"),
    (req, res, next) => {
    const { couponCode, offerName, status, startDate, endDate, type } = req.body;

    const userRole = req.user.role; 

    if (!couponCode || couponCode.trim() === "" || couponCode === null) {

        return res.status(400).json({ message: "Coupon code is required." });
    }

    if (userRole !== "admin") {
        return res.status(403).json({ message: "Unauthorized. Only admins can create coupons." });
      }

    couponServices.createCoupon({ couponCode, offerName, status, startDate, endDate, type }, (error, result) => {
        if (error) {
            console.error("Error creating coupon:", error);
            return res.status(500).json({ message: "Error creating coupon.", error: error });
        }
        if (req.file) {
            result.offerPoster = req.file.path; 
          }

        return res.status(201).json({ message: "Coupon created successfully.", data: result });
    });

}];

exports.updateCoupon = async (req, res, next) => {
    const couponId = req.params.id;
    const { couponCode, offerName, status, type, startDate, endDate } = req.body;      
    const userRole = req.user.role; 
    console.log(couponCode, offerName, "couponCode before validation");

    if (!couponCode || couponCode.trim() === "" || couponCode === null) {
        return res.status(400).json({ message: "Coupon code is required." });
    }

    console.log(couponCode, offerName,req.file, "couponCode after validation");

    if (userRole !== "admin") {
        return res.status(403).json({ message: "Unauthorized. Only admins can edit coupons." });
      }

      const updateData = { couponCode, offerName, status, type, startDate, endDate };
      if (req.file) {
        updateData.offerPoster = req.file.path; 
      }

    try {
        const result = await couponServices.updateCoupon(couponId, updateData);
        return res.status(200).json({ message: "Coupon updated successfully.", data: result });
    } catch (error) {
        console.error("Error updating coupon:", error);
        return res.status(500).json({ message: "Error updating coupon.", error: error.message });
    }
}

exports.getCouponById = async (req, res, next) => {
    const couponId = req.params.id;
    const userRole = req.user.role; 


    if (userRole !== "admin") {
        return res.status(403).json({ message: "Unauthorized. Only admins can view coupons." });
      }

    try {
        const coupon = await couponServices.getCouponById(couponId);
        return res.status(200).json({ message: "Coupon retrieved successfully.", data: coupon });
    } catch (error) {
        console.error("Error retrieving coupon:", error);
        return res.status(404).json({ message: "Coupon not found.", error: error.message });
    }
};

exports.getCoupons = async (req, res, next) => {
    const { sortBy, search } = req.query;
    const userRole = req.user.role; 

    if (userRole !== "admin") {
        return res.status(403).json({ message: "Unauthorized. Only admins can view coupons." });
      }

    try {
        const coupons = await couponServices.getCoupons({ sortBy, search });
        if (coupons.length === 0) {
            return res.status(401).json({message : "coupon not found"})
        }
        return res.status(200).json({ message: "Coupons retrieved successfully.", data: coupons });
    } catch (error) {
        console.error("Error retrieving coupons:", error);
        return res.status(500).json({ message: "Error retrieving coupons.", error: error.message });
    }
};

exports.deleteCouponById = async (req, res, next) => {
    const couponId = req.params.id;
    const userRole = req.user.role; 

    if (userRole !== "admin") {
        return res.status(403).json({ message: "Unauthorized. Only admins can create coupons." });
      }

    try {
        const coupons = await couponServices.deleteCouponById(couponId);
        return res.status(200).json({ message: "Coupon deleted successfully.", data: coupons });
    } catch (error) {
        console.error("Error deleting coupon");
        return res.status(500).json({ message: "Error deleting coupon.", error: error.message });
    }
}