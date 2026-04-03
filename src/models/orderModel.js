const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Type.ObjectId,
        ref:"User",
        required: true,
    },
    items:{
        type:[{
            product:{
                type:mongoose.Schema.Type.ObjectId,
                ref:"Product"
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }],
        required:true
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum: ["pending","processing","shipped","delivered","cancelled"],
        default:"pending",
    },
    address:{
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
},{timestamps:true,versionKey:false});


module.exports = mongoose.model("Order",orderSchema);