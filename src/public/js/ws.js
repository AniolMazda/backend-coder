const socket = io()
let productList = document.getElementById('productList')
socket.on('updateProduct',addProduct=>{
    while (productList.firstChild){
        productList.removeChild(productList.firstChild)
    }
    console.log(addProduct)
    addProduct.forEach(product => {
        productList.insertAdjacentHTML('beforeend',`<li>${product.title}</li>`)
    });
})