import { productModel } from "./models/productModel.js"

export default class ProductManager {

    static async get(page=1,limit=10,sortvalue,filter) {
        let options = {
            page,
            limit,
            lean:true
        }
        if(sortvalue !== undefined){
            options.sort = {"price":sortvalue}
        }
        return await productModel.paginate(filter, options)
    }

    static async getSelect(filter={}){
        return await productModel.find(filter).select('_id')
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