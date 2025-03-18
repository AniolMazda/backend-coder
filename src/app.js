const express=require('express')
const {Server} = require('socket.io')
const {engine} = require('express-handlebars') 
const routerProduct = require('./routes/productRouter')
const routerCart = require('./routes/cartRouter')
const viewsProductRouter = require('./routes/viewsProductRouter')

let io
const PORT = 8080
const app = express()

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