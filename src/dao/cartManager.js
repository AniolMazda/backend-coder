const fs = require("fs");

class CartManager{
    
    constructor(rutaArchivo) {
        this.path = rutaArchivo;
    }

    async getCarts() {
        if(fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
       }
    }

    async addCart() {
        const carts = await this.getCarts();
        let cartId = Math.max(...carts.map(d=>d.id))+1;
        let newCart = {id:cartId,selectedProducts:[]}
        carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return newCart;
    }

    async getCartAndProducts(id) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);
        if(!cart){
            return false;
        }
        return cart;
    }

    async addProductInCart(idCart,codeProduct){
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === idCart);
        if(!cart){
            return false;
        }
        const productIndex = cart.selectedProducts.findIndex(p => p.id === parseInt(codeProduct));
        if (productIndex !== -1) {
            cart.selectedProducts[productIndex].quantity += 1;
        } else {
            const uploadProduct = {
                id: parseInt(codeProduct),
                quantity: 1
            };
            cart.selectedProducts.push(uploadProduct);
        }
        const updatedCarts = carts.map(c => c.id === cart.id ? cart : c);
        await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts, null, "\t"));
        return cart;
    }
}

module.exports = {
    CartManager
}