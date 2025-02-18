const express=require('express');
const {ProductManager} = require('./dao/productManager');
const productManager = new ProductManager('./src/data/products.json');

const PORT = 8080;
const app = express();

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});
app.get('/products', async (req, res) => {
    
    let products = await productManager.getProducts();

    res.send(products);
});
app.listen(PORT, () => {
    console.log(`Server esta online en el puerto ${PORT}`);
});