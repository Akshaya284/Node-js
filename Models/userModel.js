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
    lowercase: true
  },
  mobileNumber: {
    type : Number,
    required: true,
    unique: true,
    minlength: [10,"Mobile number should consist 10 digits"],
    maxlength:[10,"Mobile number should consist 10 digits" ]
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

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.confirmPassword;
  },
});

UserSchema.plugin(uniqueValidator, {
  message: "Error, {PATH} already exists.",
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
