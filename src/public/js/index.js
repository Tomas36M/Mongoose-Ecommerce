const addButton = document.querySelectorAll('.add-product');
const deleteButton = document.querySelectorAll('.delete-product-cart');
const deleteProductButton = document.querySelectorAll('.delete-product');

const deleteProduct = async (pid) => {
    await fetch(`/api/products/${pid}`, {
        method: 'DELETE'
    })
}

const addProductToCart = async (pid, cid) => {
    await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'POST'
    })
}

const deleteProductFromCart = async (pid,cid) => {
    await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'DELETE'
    })
}

for (let i = 0; i < deleteProductButton.length; i++) {
    deleteProductButton[i].addEventListener("click", (e) => {
        e.preventDefault();
        deleteProduct(e.target.value)
    });
}

for (let i = 0; i < addButton.length; i++) {
    addButton[i].addEventListener("click", (e) => {
        e.preventDefault();
        addProductToCart(e.target.value)
    });
}

for (let i = 0; i < deleteButton.length; i++) {
    deleteButton[i].addEventListener("click", (e) => {
        e.preventDefault();
        deleteProductFromCart(e.target.value)
    });
}