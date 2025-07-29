function maxLengths(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "... <span class='text-blue-600 underline cursor-pointer' id='read-more'>Show More</span>";
}

function fullTextWithToggle(text) {
    return text + ` <span class='text-blue-600 underline cursor-pointer' id='show-less'>Show Less</span>`;
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

const decreaseBtn = document.getElementById('decrease-qty');
const increaseBtn = document.getElementById('increase-qty');
const quantitySpan = document.getElementById('quantity');

let quantity = 1;

increaseBtn.addEventListener('click', () => {
    quantity++;
    quantitySpan.textContent = quantity;
});

decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));

    if (!product) {
        document.getElementById("product-title").textContent = "Produk tidak ditemukan";
        return;
    }

    const price = product.discountedPrice || product.price ;
    const priceIDR = parseFloat(price);

    document.getElementById("product-image").src = product.image;
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-price").textContent = formatRupiah(priceIDR * 16000);
    document.getElementById("product-rating").textContent = `${product.rating.rate} ⭐ (${product.rating.count} rating)`;

    const fullDescription = product.description;
    const descElement = document.getElementById("product-description");
    descElement.innerHTML = maxLengths(fullDescription, 50);

    descElement.addEventListener("click", (e) => {
        if (e.target.id === 'read-more') {
            descElement.innerHTML = fullTextWithToggle(fullDescription);
        } else if (e.target.id === 'show-less') {
            descElement.innerHTML = maxLengths(fullDescription, 50);
        }
    });
});

const addToCartBtn = document.getElementById("add-to-cart-btn");
addToCartBtn.addEventListener("click", () => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!product) return alert("Produk tidak ditemukan");

    const qty = quantity;
    const price = parseFloat(product.discountedPrice || product.price);

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
        cartItems[existingIndex].quantity += qty;
    } else {
        cartItems.push({
            id: product.id,
            title: product.title,
            price: price,
            image: product.image,
            description: product.description,
            quantity: qty
        });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert(`Berhasil menambahkan ${qty} "${product.title}" ke keranjang!`);
});

const checkoutButton = document.getElementById("checkoutButton");
checkoutButton.addEventListener("click", () => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!product) return alert("Produk tidak ditemukan");

    const qty = quantity;
    const price = parseFloat(product.discountedPrice || product.price);

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
        cartItems[existingIndex].quantity += qty;
    } else {
        cartItems.push({
            id: product.id,
            title: product.title,
            price: price,
            image: product.image,
            description: product.description,
            quantity: qty
        });
    }

    localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
    window.location.href = "../html/checkout.html";
});
