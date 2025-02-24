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
        let cartId = carts.length + 1;
        let newCart = {id:cartId,selectedProducts:[]}
        await carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return newCart;
    }

    async getCartAndProducts(id) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);
        if(!cart){
            return false;
        }
        return cart.selectedProducts;
    }

    async addProductInCart(idCart,codeProduct,quantity){
        const carts = await this.getCarts();
        let newCarts = carts.filter(cart => cart.id !== idCart);
        let updateCart;
        const cart = carts.find(cart => cart.id === idCart);
        if(!cart){
            return false;
        }
        if(cart.selectedProducts.length > 0){
            const verifyProducts = cart.selectedProducts.find(product => product.code === codeProduct);
            if(verifyProducts){
                verifyProducts.quantity += quantity;
                let updateProduct = {
                    code:codeProduct,
                    quantity:verifyProducts.quantity
                }
                updateCart = {id:newCarts.length + 1, selectedProducts:[updateProduct]}
                newCarts.push(updateCart)
                await fs.promises.writeFile(this.path, JSON.stringify(newCarts, null, "\t"));
                return updateCart;
            }
        }
        const uploadProduct = {
            code:codeProduct,
            quantity:quantity
        }
        updateCart = {id:newCarts.length + 1, selectedProducts:[uploadProduct]}
        newCarts.push(updateCart);
        await fs.promises.writeFile(this.path, JSON.stringify(newCarts, null, "\t"));
        return cart;
    }
}

module.exports = {
    CartManager
}