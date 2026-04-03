const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    rating: {
        type:Number,
        max: 5,
        min: 1,
    },
    comment: {
        type:String,
        required: true,
    },
},{timestamps:true,versionKey:false});

module.exports = mongoose.model("Review",reviewSchema);