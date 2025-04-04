import {Router} from 'express'
import ProductManager from '../dao/productManagerDB.js'

const router = Router()

router.get('/', async (req, res) => {
    try{
        const products = await ProductManager.get()
        return res.render('home', {products})
    }
    catch{
        return console.error('Internal Error')
    }
})
router.get('/realtimeproducts', async (req, res) => {
    try{
        const products = await ProductManager.get()
        return res.render('realTimeProducts', {products})
    }
    catch{
        return console.error('Internal Error')
    }
})

export {router as viewsProductRouter}