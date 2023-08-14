const couponController = require("../Controllers/couponController");
const auth = require("../Middlewares/auth")

const express = require("express");
const router = express.Router();


router.post("/create-coupon", couponController.createCoupon);
router.put("/:id", couponController.updateCoupon)
router.get("/:id", couponController.getCouponById);
router.delete("/:id", couponController.deleteCouponById)
router.get("/", couponController.getCoupons);

module.exports = router;