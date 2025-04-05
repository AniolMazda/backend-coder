import {Router} from 'express'
import { isValidObjectId } from 'mongoose'
import ProductManager from '../dao/productManagerDB.js'

const router = Router()

router.get('/', async (req, res) => {
    try{
        let {page} = req.query
        if(!page){
            page=1
        }
        const {totalPages, hasNextPage, nextPage, hasPrevPage, prevPage} = await ProductManager.get(page);
        let prevLink = !hasPrevPage ? null : `/?page=${prevPage}`,
            nextLink = !hasNextPage ? null : `/?page=${nextPage}`
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({status:"success",
            payload: "Resultado de los productos solicitados",
            totalPages,
            prevPage,
            nextPage,
            page:parseInt(page),
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({status: "Error"});
    }
});
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json("El Id que escribiste es invalido");
    }
    const product = await ProductManager.getBy({_id:id});
    if(!product){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Producto que esta buscando no existe");
    }
    try{
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(product);
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
});
router.post('/', async (req, res) => {
    const {title,description,price,thumbnail,code,stock} = req.body
    if(!title || !price || !code){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json("Los campos Title, Price y Code son obligatorios");
    }
    try{
        const validarExistencia = await ProductManager.getBy({code})
        if(validarExistencia){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json("El producto que intenta agregar ya existe");
        }
        const addProduct = await ProductManager.add({title,description,price,thumbnail,code,stock})
        req.io.emit('updateProduct',addProduct)
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({message:"El producto ha sido agregado exitosamente",
            addProduct});
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
});
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const updateProduct = req.body
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json("El Id que escribiste es invalido")
    }
    const verifyProduct = await ProductManager.getBy({_id:id})
    if(!verifyProduct){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Producto que vas a actualizar no existe")
    }
    const products = await ProductManager.get()
    let sameCode = products.some(u=>u.code===updateProduct.code)
    if(sameCode){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json("El Code que deseabas agregar ya existe y no se puede repetir")
    }
    try{
        const modifyProduct = await ProductManager.update(id,updateProduct)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({message:"El producto ha sido modificado",modifyProduct})
    }
    catch{
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({Error: "Internal Server Error"})
    }
});
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json("El Id que escribiste es invalido")
    }
    const verifyProduct = await ProductManager.getBy({_id:id})
    if(!verifyProduct){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Producto que vas a eliminar no existe")
    }
    try{
        const deleteProduct = await ProductManager.delete(id)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({message:"El producto ha sido eliminado",deleteProduct})
    }
    catch{
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({Error: "Internal Server Error"})
    }
});

export {router as "routerProduct"}