const socket = io();

const productsContainer = document.getElementById("products-card");
const createProductForm = document.getElementById("create-product-form");

const deleteProdcut = async (id) => {
    await fetch(`/api/products/${id}`), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }
}

socket.on("products", (products) => {

    const allProductsElements = products
        .map(
            (product) => ` 
            <div class="col-sm-3 mb-4">   
            <div class="card" style="width: 18rem;">
                <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/assortment-of-colorful-ripe-tropical-fruits-top-royalty-free-image-995518546-1564092355.jpg" class="card-img-top" alt="img">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Category: ${product.category}</p>
                    <a href='/products/${product._id}'>Prodcut url</a>
                </div>
            </div>
            </div>
    `
        )
        .join(" ");

    productsContainer.innerHTML = allProductsElements;
});

createProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(createProductForm);

    const product = {};

    for (const field of formData.entries()) {
        product[field[0]] = field[1];
    }

    const response = await fetch("/api/products", {
        body: JSON.stringify(product),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const responseJson = await response.json();
    console.log(responseJson);
});