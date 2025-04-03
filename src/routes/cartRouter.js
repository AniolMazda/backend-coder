import {Router} from 'express'
import CartManager from '../dao/cartManager.js'
const cartManager = new CartManager('./src/data/carts.json');

const router = Router()

router.post('/', async (req, res) => {
    const addCart = await cartManager.addCart();
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({message:`se ha creado un nuevo carrito #${addCart.id}`});
});
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const listProducts = await cartManager.getCartAndProducts(parseInt(id));
    !listProducts ? res.status(400).json({message:'Carrito No encontrado'}) :
    res.setHeader('Content-Type', 'application/json');
    res.json(listProducts);
});
router.post('/:cid/product/:pid', async (req, res) => {
    const {cid,pid} = req.params;
    const addProductInCart = await cartManager.addProductInCart(parseInt(cid),pid);
    !addProductInCart ? res.status(400).json({message:'Carrito No encontrado'}) :
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({
        message:"se ha agregado el producto",
        ...addProductInCart
    });
});

export {router as routerCart}