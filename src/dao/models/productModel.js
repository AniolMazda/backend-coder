import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

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

productSchema.plugin(paginate)

export const productModel = mongoose.model(
    "products",
    productSchema
)