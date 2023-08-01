const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type : Number,
    required: true,
    unique: true,
    length: 10
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword : {
    type: String,
    required: true,
  },
});


UserSchema.plugin(uniqueValidator, {
  message: "Error, {PATH} already exists.",
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
