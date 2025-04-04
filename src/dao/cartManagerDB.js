import { cartModel } from "./models/cartModel.js"
import mongoose from "mongoose"

export default class CartManager{
    
    static async get() {
        return await cartModel.find().lean()
    }

    static async getBy(filter={}){
        return await cartModel.findOne(filter).lean()
    }

    static async getByCart(filter={}){
        return await cartModel.findOne(filter).populate("selectedProduct.product").lean()
    }

    static async add() {
        return await cartModel.create()
    }

    static async addProduct(cid,pid){
        const cart = await this.getBy({_id:cid})
        const productIndex = cart.selectedProduct.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.selectedProduct[productIndex].quantity += 1;
        } else {
            const uploadProduct = {
                product: pid,
                quantity: 1
            };
            cart.selectedProduct.push(uploadProduct);
        }

        return await cartModel.findByIdAndUpdate(cid, { selectedProduct: cart.selectedProduct }, { new: true }).lean();
    }

    static async updateProduct(id,modify){
        const cart = await this.getBy({_id:id})
        const productIndex = cart.find(c=>modify.find(m=>c.product === m.product))
        console.log(modify,productIndex)
        /*if (productIndex !== -1) {
            cart.selectedProduct[productIndex].quantity += 1;
        } else {
            const uploadProduct = {
                product: pid,
                quantity: 1
            };
            cart.selectedProduct.push(uploadProduct);
        }

        return await cartModel.findByIdAndUpdate(cid, { selectedProduct: cart.selectedProduct }, { new: true }).lean();*/
        //return await cartModel.findByIdAndUpdate(id,{selectedProduct: modify},{new:true}).lean()
    }

    static async delete(id){
        return await cartModel.findByIdAndDelete(id).lean()
    }
}