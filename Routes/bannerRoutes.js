const bannerController = require("../Controllers/bannerController")

const express = require("express");
const router = express.Router();


router.post("/create-banner", bannerController.createBanner);
router.put("/:id", bannerController.editBanner);
router.get("/:id", bannerController.getBannerById);
router.get("/", bannerController.getBanner);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;