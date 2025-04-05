import {mongoose, isValidObjectId} from "mongoose"

export const validateId = async (req, res, next) => {
    const {id} = req.params
    if(!isValidObjectId(id)){
        console.log(id)
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json("El Id que escribiste es invalido")
    }
    next()
} 