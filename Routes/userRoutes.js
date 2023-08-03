const usersController = require("../Controllers/userController");

const express = require("express");
const router = express.Router();

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/user-profile", usersController.getUserProfile);
router.post("/logout",usersController.logout)

module.exports = router;