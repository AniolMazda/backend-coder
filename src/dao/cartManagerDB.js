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
        return await cartModel.create({})
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
        const cart = await this.getBy({_id:id});
        const cartMap = new Map(
            cart.selectedProduct.map(item => [item.product.toString(), item])
        )
        for (const mod of modify) {
            const modProductId = mod.product;
            if (cartMap.has(modProductId)) {
                // Ya existe: actualizar cantidad
                cartMap.get(modProductId).quantity += mod.quantity;
            } else {
                // No existe: agregar al carrito
                cart.selectedProduct.push({
                    product: mod.product,
                    quantity: mod.quantity,
                });
            }
        }
        return await cartModel.findByIdAndUpdate(id, { selectedProduct: cart.selectedProduct }, { new: true }).lean();
    }

    static async updateOneProduct(cid,pid,q){
        const cart = await this.getBy({_id:cid})
        const productIndex = cart.selectedProduct.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.selectedProduct[productIndex].quantity += q.quantity;
        } else {
            const uploadProduct = {
                product: pid,
                quantity: q.quantity
            };
            cart.selectedProduct.push(uploadProduct);
        }

        return await cartModel.findByIdAndUpdate(cid, { selectedProduct: cart.selectedProduct }, { new: true }).lean();
    }

    static async delete(id){
        return await cartModel.findByIdAndUpdate(
            id,
            { $set: {selectedProduct: [] }},
            { new: true }
        ).lean()
    }
    static async deleteProduct(cid,pid){
        return await cartModel.findByIdAndUpdate(
            cid,
            { $pull: { selectedProduct: { product: pid } } },
            { new: true }
        );
    }
}