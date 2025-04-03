import {Router} from 'express'
import ProductManager from '../dao/productManager.js'
const productManager = new ProductManager('./src/data/products.json');

const router = Router()

router.get('/', async (req, res) => {
    try{
        const products = await productManager.getProducts()
        return res.render('home', {products})
    }
    catch{
        return console.error('Internal Error')
    }
})
router.get('/realtimeproducts', async (req, res) => {
    try{
        const products = await productManager.getProducts()
        return res.render('realTimeProducts', {products})
    }
    catch{
        return console.error('Internal Error')
    }
})

export {router as viewsProductRouter}