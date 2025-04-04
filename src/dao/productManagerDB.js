import { productModel } from "./models/productModel.js"

export default class ProductManager {

    static async get() {
        return await productModel.find().lean()
    }

    static async getBy(filter={}){
        return await productModel.findOne(filter).lean()
    }

    static async add(producto){
        return await productModel.create(producto)
    }

    static async update(id,modify){
        return await productModel.findByIdAndUpdate(id,modify,{new:true}).lean()
    }
    static async delete(id){
        return await productModel.findByIdAndDelete(id).lean()
    }
}