import {Router} from 'express'
import ProductManager from '../dao/productManagerDB.js'
import CartManager from '../dao/cartManagerDB.js'

const router = Router()

router.get('/', async (req, res) => {
    try{
        let {page,limit,sort,priceMin,priceMax} = req.query
        let filter = {}
        if(!page){
            page=1
        }
        if(sort === "1" || sort === "-1"){
            sort = parseInt(sort)
            console.log(typeof sort)
        }
        if(priceMin && priceMax){
            filter.price = { $gte: parseInt(priceMin), $lte: parseInt(priceMax) }
        }
        const {docs:products, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage} = await ProductManager.get(page,limit,sort,filter)
        return res.render('home', {
            products,
            totalPages,
            hasNextPage,
            nextPage,
            hasPrevPage,
            prevPage,
            page
        })
    }
    catch(err){
        return console.error('Internal Error',err)
    }
})
router.get('/realtimeproducts', async (req, res) => {
    try{
        const {docs:products} = await ProductManager.get()
        return res.render('realTimeProducts', {products})
    }
    catch(err){
        console.error(err)
        return console.error('Internal Error')
    }
})
router.get('/product/:id', async (req, res) => {
    try{
        const {id} = req.params
        const product = await ProductManager.getBy({_id:id})
        return res.render('productDetail', {product,cart})
    }
    catch(err){
        console.error(err)
        return console.error('Internal Error')
    }
})
router.get('/carts/:id', async (req, res) => {
    try{
        const {id} = req.params
        const cart = await CartManager.getByCart({_id:id})
        return res.render('cart', {cart})
    }
    catch(err){
        console.error(err)
        return console.error('Internal Error')
    }
})

export {router as viewsProductRouter}