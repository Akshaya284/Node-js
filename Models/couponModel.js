const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: [true, "Coupon code should be unique"]
    },
    status: {
        type: Boolean,
        required: true
    },
    offerName: {
        type: String,
        required: true
    },
    type: {
        type : String,
        enum : {
            values : ["Regular", "Product", "Molecule"]
        },
        required : true
    },
    startDate :{
        type : Date,
        required : true
    },
    endDate : {
        type : Date,
        required : true
    },
    offerPoster : {
        type : String,
        // data : Buffer,
    }

});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;