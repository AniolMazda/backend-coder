import {Router} from 'express'
import { isValidObjectId } from 'mongoose'
import CartManager from '../dao/cartManagerDB.js'
import ProductManager from '../dao/productManagerDB.js'
import { validateId } from '../middlewares/verification.js'

const router = Router()

router.post('/', async (req, res) => {
    try{
        const addCart = await CartManager.add();
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({message:`se ha creado un nuevo carrito N°: ${addCart.id}`});
    }
    catch(err){
        res.setHeader('Content-Type', 'application/json');
        console.error(err)
        return res.status(500).json({Error: "Internal Server Error"});
    }
});
router.get('/:id', validateId, async (req, res) => {
    const {id} = req.params;
    const cart = await CartManager.getByCart({_id:id});
    if(!cart){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Carrito que esta buscando no existe");
    }
    try{
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(cart);
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }    
});
router.post('/:cid/products/:pid', async (req, res) => {
    const {cid,pid} = req.params
    if(!isValidObjectId(cid) && !isValidObjectId(pid)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json("El Id que escribiste del carrito o producto es invalido");
    }
    const verifyCart = await CartManager.getBy({_id:cid})
    const verifyProduct = await ProductManager.getBy({_id:pid})
    if(!verifyCart || !verifyProduct){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Carrito no existe o Producto que vas a agregar no existe")
    }
    try{
        const addProductInCart = await CartManager.addProduct(cid,pid)
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({message:"El producto ha sido agregado al carrito",
            addProductInCart});
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
});
router.put('/:id', validateId, async (req,res) => {
    const {id} = req.params
    const updateProduct = req.body
    const verifyCart = await CartManager.getBy({_id:id})
    if(!verifyCart){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Carrito no existe")
    }
    //Filtro para verificar que todos los ids escritos en body esten correctos
    const ids = updateProduct.map(p => p.product)

    const productsExist = await ProductManager.getSelect({ _id: { $in: ids }})
    const productsId = productsExist.map(p => p._id.toString());
    
    const productNotFound = updateProduct.filter(p => !productsId.includes(p.product));

    if (productNotFound.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({
        mensaje: 'Algunos productos no fueron encontrados',
        noEncontrados: productNotFound.map(p => p.product),
        });
    }

    try{
        const updateCart = await CartManager.updateProduct(id,updateProduct);
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({message:"El carrito ha sido actualizado",updateCart})
    }
    catch(err){
        res.setHeader('Content-Type', 'application/json');
        console.error(err)
        return res.status(500).json({Error: "Internal Server Error"});
    }
})
router.put('/:cid/products/:pid', async (req,res) => {
    const {cid,pid} = req.params
    const quantity = req.body
    if(!isValidObjectId(cid) && !isValidObjectId(pid)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json("El Id que escribiste del carrito o producto es invalido");
    }
    const verifyCart = await CartManager.getBy({_id:cid})
    const verifyProduct = await ProductManager.getBy({_id:pid})
    if(!verifyCart || !verifyProduct){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Carrito no existe o Producto que vas a agregar no existe")
    }
    try{
        const updateCart = await CartManager.updateOneProduct(cid,pid,quantity);
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({message:"El carrito ha sido actualizado",updateCart})
    }
    catch(err){
        res.setHeader('Content-Type', 'application/json');
        console.error(err)
        return res.status(500).json({Error: "Internal Server Error"});
    }
})
router.delete('/:id', validateId, async (req,res) => {
    const {id} = req.params
    const verifyCart = await CartManager.getBy({_id:id})
    if(!verifyCart){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Carrito no existe")
    }
    try{
        await CartManager.delete(id)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({message:`Los productos del carrito ${id} han sido eliminados`});
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
})
router.delete('/:cid/products/:pid', async (req,res) => {
    const {cid,pid} = req.params
    if(!isValidObjectId(cid) && !isValidObjectId(pid)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json("El Id que escribiste del carrito o producto es invalido");
    }
    const verifyCart = await CartManager.getBy({_id:cid})
    const verifyProduct = await ProductManager.getBy({_id:pid})
    if(!verifyCart || !verifyProduct){
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json("El Carrito no existe o Producto que vas a agregar no existe")
    }
    try{
        const deleteProduct = await CartManager.deleteProduct(cid,pid)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({message:"El producto ha sido eliminado del carrito",
            deleteProduct});
    }
    catch(err){
        res.setHeader('Content-Type', 'application/json');
        console.error(err)
        return res.status(500).json({Error: "Internal Server Error"});
    }
})

export {router as routerCart}