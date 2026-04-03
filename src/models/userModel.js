const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
    },
    role: {
        type:String,
        enum: ["admin","customer"],
        required:true,
        default: "customer",
    },
    profilePic: {
        type:String,
        default:null,
    },
    adress: {
        street:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true,
        },
    },
    phone: {
        type:String,
    }
},{timestamps:true,versionKey:false});

module.exports = mongoose.model("User",userShema);