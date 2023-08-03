const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    loggedInAt : {
        type : Date,
        required : true
    },
    loggedOutAt : {
        type : Date,
    },
    status : {
        type : String,
        enum : ["active", "inActive"],
        default : "active",
    }
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;