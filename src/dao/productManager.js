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
        let products = await this.getProducts();
        let id = 1;
        if(products.length > 0) {
            id = products.length + 1;
        }
        let nuevoProducto = {
            id: id,
            ...producto
        }
        products.push(nuevoProducto);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return nuevoProducto;
    }
    async getProductById(id) {
        let products = await this.getProducts();
        return products.find(product => product.id == id);
    }
}

module.exports = {
    ProductManager
}