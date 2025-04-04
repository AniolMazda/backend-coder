import mongoose from "mongoose"

const productSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        description: String,
        price:{
            type:Number,
            required:true
        },
        thumbnail: String,
        code:{
            type:String,
            required:true,
            unique:true
        },
        stock:{
            type:Number,
            default:0
        }
    },
    {
        timestamps:true
    }
)

export const productModel = mongoose.model(
    "products",
    productSchema
)