const express=require('express');
const {ProductManager} = require('./dao/productManager');
const {CartManager} = require('./dao/cartManager');
const productManager = new ProductManager('./src/data/products.json');
const cartManager = new CartManager('./src/data/carts.json');

const PORT = 8080;
const app = express();
app.use(express.json());

app.get('/api/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});
app.get('/api/products/:id', async (req, res) => {
    const {id} = req.params;
    const products = await productManager.getProducts();
    const productFilter = await products.find(u => u.id === parseInt(id));
    res.json(productFilter);
});
app.post('/api/products', async (req, res) => {
    const newProduct = req.body;
    const addProduct = await productManager.addProduct(newProduct);
    res.status(201).json(addProduct);
});
app.put('/api/products/:id', async (req, res) => {
    const {id} = req.params;
    const modifyProduct = req.body;
    const products = await productManager.editProduct({id:parseInt(id), ...modifyProduct});
    !products ? res.status(400).json({message:'Usuario No encontrado'}) :
    res.json(products);
});
app.delete('/api/products/:id', async (req, res) => {
    const {id} = req.params;
    const deleteProduct = await productManager.deleteProduct(parseInt(id));
    !deleteProduct ? res.status(400).json({message:'Usuario No encontrado'}) :
    res.json(deleteProduct);
});
app.post('/api/carts', async (req, res) => {
    const addCart = await cartManager.addCart();
    res.status(201).json({message:`se ha creado un nuevo carrito #${addCart.id}`});
});
app.get('/api/carts/:id', async (req, res) => {
    const {id} = req.params;
    const listProducts = await cartManager.getCartAndProducts(parseInt(id));
    !listProducts ? res.status(400).json({message:'Carrito No encontrado'}) :
    res.json(listProducts);
});
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const {cid,pid} = req.params;
    const {quantity} = req.body;
    const addProductInCart = await cartManager.addProductInCart(parseInt(cid),pid,quantity);
    !addProductInCart ? res.status(400).json({message:'Carrito No encontrado'}) :
    res.status(201).json({
        message:"se ha agregado el producto",
        ...addProductInCart
    });
});
app.listen(PORT, () => {
    console.log(`Server esta online en el puerto ${PORT}`);
});