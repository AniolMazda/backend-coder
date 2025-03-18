const {Router} = require('express');
const { ProductManager } = require('../dao/productManager');
const productManager = new ProductManager('./src/data/products.json');

const router = Router()

router.get('/realtimeproducts', async (req, res) => {
    try{
        const products = await productManager.getProducts()
        return res.render('realTimeProducts', {products})
    }
    catch{
        return console.error('Internal Error')
    }
})

module.exports=router