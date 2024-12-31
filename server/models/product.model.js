import mongoose from "mongoose";
const Productschema =mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Please enter product name"]
        },
        quantity:{
            type:Number,
            required: true,
            default:0
        },
        price:{
            type:Number,
            required: true,
            default:0
        },
        photo:{
            type:String,
            required: false
        }
    },
    {
        Timestamp:ture
    }
);
const Product = mongoose.model("Product", Productschema);
module.exports = Product;