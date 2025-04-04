import express from 'express'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import {routerProduct} from './routes/productRouter.js'
import {routerCart} from './routes/cartRouter.js'
import {viewsProductRouter} from './routes/viewsProductRouter.js'
import {config} from './config/config.js'

let io
const PORT = config.PORT
const app = express()
const MongoDB = async () => {
    try{
        await mongoose.connect(
            config.MONGO_URI,{
                dbName:config.MONGODB_NAME
            }
        )
        console.log("Se ha hecho la conexión con la base de datos")
    }
    catch(error){
        console.error("No se pudo realizar la conexión"+error.message)
    }
}
MongoDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./src/public'))

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views','./src/views')

app.use('/api/products',
    (req, res, next)=>{
        req.io=io
        next()
    },routerProduct)
app.use('/api/carts', routerCart)
app.use('/', viewsProductRouter)

const serverHTTP = app.listen(PORT, () => {
    console.log(`Server esta online en el puerto ${PORT}`)
});

io = new Server(serverHTTP)