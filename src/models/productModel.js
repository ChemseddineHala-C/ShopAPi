const mongoose = require("mongoose");

const productShema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min: 0,
    },
    category:{
        type:String,
        enum: ["electronics","clothing","books","food","other"],
    },
    stock:{
        type:Number,
        required:true,
        min:0,
    },
    image:{
        type:String,
        default:null,
    },
    avgRating:{
        type:Number,
        default: 0,
    },
},{timestamps:true,versionKey:false});

module.exports = mongoose.model("Product",productShema);
