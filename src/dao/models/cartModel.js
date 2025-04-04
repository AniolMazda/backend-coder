import mongoose from "mongoose"

const cartSchema = mongoose.Schema(
    {
        selectedProduct:{
            type:[
                {
                    product:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:"products"
                    },
                    quantity: Number
                }
            ]
        }
    },
    {
        timestamps:true
    }
)

export const cartModel = mongoose.model(
    "carts",
    cartSchema
)