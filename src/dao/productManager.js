const fs = require('fs');

class ProductManager {

    constructor(rutaArchivo) {
        this.path = rutaArchivo;
    }

    async getProducts() {
        if(fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
        }
    }
    async addProduct(producto) {
        const products = await this.getProducts();
        let id = 1;
        if(products.length > 0) {
            id = Math.max(...products.map(d=>d.id))+1;
        }
        let nuevoProducto = {
            id: id,
            ...producto
        }
        products.push(nuevoProducto);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return nuevoProducto;
    }
    async editProduct(producto) {
        const products = await this.getProducts();
        let selectProduct = products.find(product => product.id === producto.id);
        if(!selectProduct){
            return false;
        }
        selectProduct = {...producto};
        const updateProducts = await products.map((product) => {
            if(product.id === selectProduct.id){
                product = {...selectProduct}        
            }
            return product;
        });
        await fs.promises.writeFile(this.path, JSON.stringify(updateProducts, null, "\t"));
        return selectProduct;
    }
    async deleteProduct(id) {
        const products = await this.getProducts();
        const authenProduct = products.find(p => p.id === id);
        if(!authenProduct){
            return false;
        }
        const resultProducts = products.filter(product => product.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(resultProducts, null, "\t"));
        return resultProducts;
    }
}

module.exports = {
    ProductManager
}