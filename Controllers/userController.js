const bcrypt = require("bcryptjs");
const userServices = require("../Services/userServices");
const User = require('../Models/userModel');


exports.register = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const salt = bcrypt.genSaltSync(10);

  req.body.password = bcrypt.hashSync(password, salt);

  userServices.register(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.login = (req, res, next) => {
  const { email, mobileNumber, password } = req.body;

  userServices.login({ email, mobileNumber, password }, (error, results) => {
    if (error) {
      return next(error);
    };
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.getUserProfile = (req, res, next) => {
  const userId = req.user.userId;
  console.log(req.user, "userId");

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      User.findById(userId).then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }

        const userProfile = {
          username: user.username,
          email: user.email,
          mobileNumber: user.mobileNumber,
        };

        return res.status(201).send({
          message: "User profile retrieved successfully",
          data: userProfile,
        });
      })
        .catch((error) => {
          return next(error);
        });
    })
};

exports.logout = (req, res, next) => {
  const { userId, sessionId, } = req.user;

  userServices.logout(userId, sessionId, (error, result) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: result.message,
    });
  });
};





