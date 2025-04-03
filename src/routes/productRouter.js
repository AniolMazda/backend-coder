import {Router} from 'express'
import ProductManager from '../dao/productManager.js'
const productManager = new ProductManager('./src/data/products.json');

const router = Router()

router.get('/', async (req, res) => {
    try{
        const products = await productManager.getProducts();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(products);
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
});
router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const products = await productManager.getProducts();
        const productFilter = await products.find(u => u.id === parseInt(id));
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(productFilter);
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
});
router.post('/', async (req, res) => {
    try{
        const newProduct = req.body;
        const addProduct = await productManager.addProduct(newProduct)
        let lastProduct = addProduct.slice(-1)
        req.io.emit('updateProduct',addProduct)
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({message:"El producto ha sido agregado exitosamente",
            lastProduct});
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
});
router.put('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const modifyProduct = req.body;
        const products = await productManager.editProduct({id:parseInt(id), ...modifyProduct});
        if(!products){
            res.status(400).json({message:'Producto No encontrado'})
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(products);
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
});
router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const products = await productManager.getProducts();
        let deletedProduct = await products.find(u => u.id === parseInt(id));
        const deleteProduct = await productManager.deleteProduct(parseInt(id));
        if(!deleteProduct){
            res.status(400).json({message:'Producto No encontrado'})
        }
        req.io.emit('updateProduct',deleteProduct)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({message:"El siguiente producto fue eliminado",
            deletedProduct
        });
    }
    catch{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({Error: "Internal Server Error"});
    }
});

export {router as "routerProduct"}