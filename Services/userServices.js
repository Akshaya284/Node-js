const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const auth = require("../Middlewares/auth");


async function login({ email, mobileNumber, password }, callback) {
  // const user = await User.findOne({ email });
  let user;
  
  if (email) {
    user = await User.findOne({ email });
  } else if (mobileNumber) {
    user = await User.findOne({ mobileNumber });
  } else {
    return callback({
      message: "Please provide either email or mobile number for login.",
    });
  }

  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(user._id.toString());
      return callback(null, { ...user.toJSON(), token });
    } else {
      return callback({
        message: "Invalid email/Password!",
      });
    }
  } else {
    return callback({
      message: "Invalid email/Password!",
    });
  }
}

async function register(params, callback) {
  if (params.username === undefined) {
    console.log(params.username);
    return callback(
      {
        message: "Username Required",
      },
      ""
    );
  }

  const user = new User(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}



module.exports = {
  login,
  register,
};
