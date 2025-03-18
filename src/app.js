const express=require('express');
const {engine} = require('express-handlebars') 
const routerProduct = require('./routes/productRouter')
const routerCart = require('./routes/cartRouter')
const viewsProductRouter = require('./routes/viewsProductRouter')

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views','./src/views')

app.use('/api/products', routerProduct)
app.use('/api/carts', routerCart)
app.use('/', viewsProductRouter)

app.listen(PORT, () => {
    console.log(`Server esta online en el puerto ${PORT}`)
});