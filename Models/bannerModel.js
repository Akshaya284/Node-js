const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
   title : {
    type: String,
    // required : true,
   },
   bannerImage : {
    type : String,
    // required : true,
    unique : true
   },
   status : {
    enum : ["active", "inActive"],
    // required : true
   }
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;