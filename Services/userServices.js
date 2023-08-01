const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const auth = require("../Middlewares/auth");


async function login({ email, password }, callback) {
  const user = await User.findOne({ email });

  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(email);
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
