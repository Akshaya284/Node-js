const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const auth = require("../Middlewares/auth");
const Session = require('../Models/sessionModel')


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
      const session = new Session({
        userId : user._id,
        loggedInAt : new Date (), 
      });  
      session.save().then(()=>{
        const token = auth.generateAccessToken(user._id.toString(), session._id.toString(), user.role.toString());
        return callback(null, { ...user.toJSON(), token });
      });
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
      const session = new Session ({
        userId : response._id,
        loggedInAt : new Date(),
      });
      session.save().then(()=>{
        const token = auth.generateAccessToken(response._id.toString(), session._id.toString(), response.role.toString());
        return callback(null, {...response.toJSON(), token });
      });
    })
    .catch((error) => {
      return callback(error);
    });
};

async function logout(userId, sessionId, callback) {
  Session.findByIdAndUpdate(
    sessionId,  
    {status : "inactive"},
    {new : true}
  )
  .then((updatedSession)=> {
    if(!updatedSession){
      return callback({ message : "Session not found"});
    }
    return callback(null, {message : "Logout Successfull."});
  })
  .catch((error)=>{
    console.error("Error updating session:", error);
    return callback(error);
  })
}



module.exports = {
  login,
  register,
  logout
};
