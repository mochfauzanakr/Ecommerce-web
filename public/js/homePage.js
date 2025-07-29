let allProducts = [];
let productIndex = 15;

async function fetchProducts() {
    if (allProducts.length > 0) return allProducts;

    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        allProducts = data;
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
}
// Categories Section
async function loadCategories() {
    const products = await fetchProducts();
    const categoriesContainer = document.getElementById('categories-container');

    if (!categoriesContainer) return;

    const categories = [...new Set(products.map(product => product.category))];

    categories.slice(0, 6).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-box text-center shadow rounded-lg p-4 bg-white cursor-pointer transform transition duration-300 hover:scale-105';
        const exampleProduct = products.find(p => p.category === category);

        categoryDiv.innerHTML = `
            <img src="${exampleProduct?.image}" 
                 width="80"
                 alt="${category}" 
                 class="mx-auto mb-2"/>
            <p>${category}</p>
        `;
        categoriesContainer.appendChild(categoryDiv);
    });
}

// Flash Sale Section
async function loadFlashSale() {
    const products = await fetchProducts();
    const flashSaleContainer = document.getElementById('flash-sale-container');

    if (!flashSaleContainer) return;

    products.slice(0, 5).forEach(product => {
        const flashSaleItem = document.createElement('div');
        flashSaleItem.className = 'relative bg-white rounded-lg shadow p-4 text-center cursor-pointer transform transition duration-300 hover:scale-105';
        
        const discountedPrice = (product.price / 1.5).toFixed(2);
        const discountedPriceIdr = discountedPrice * 16000;

        flashSaleItem.innerHTML = `
            <div class="absolute top-2 right-2 bg-[#00171F] text-white text-xs px-2 py-0.5 rounded">-25%</div>
            <img src="${product.image}" 
                 alt="${product.title}" 
                 class="w-24 h-24 mx-auto mb-4 object-contain">
            <p class="text-base font-semibold mb-2">${formatRupiah(discountedPriceIdr)}</p>
            <div class="w-full bg-gray-300 h-6 rounded-full overflow-hidden">
                <div class="h-full flex items-center justify-center text-center font-medium text-white" 
                     style="width: 60%; background-color: #1A1037;">
                    Stok Terbatas
                </div>
            </div>
        `;

        flashSaleItem.addEventListener('click', () => {
            const productWithDiscount = { ...product, discountedPrice };
            localStorage.setItem('selectedProduct', JSON.stringify(productWithDiscount));
            window.location.href = 'detailProduct.html';
        });

        flashSaleContainer.appendChild(flashSaleItem);
    });
}

// Popular Items
function displayPopularItems(products) {
    const popularContainer = document.getElementById('popular-container');
    if (!popularContainer) return;

    const locations = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Surakarta', 'Depok', 'Palembang'];

    products.forEach(product => {
        const popularItem = document.createElement('div');
        const priceIDR = product.price * 16000;
        const originalPriceIDR = product.price * 2 * 16000;
        const location = locations[Math.floor(Math.random() * locations.length)];
        popularItem.className = 'bg-white rounded-lg shadow p-4 border cursor-pointer transform transition duration-300 hover:scale-105';

        popularItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="w-30 h-30 mx-auto mb-4 object-contain">
            <p class="text-sm text-gray-600">
                <i class="fa-solid fa-star" style="color: #FFD43B;"></i> 
                ${product.rating.rate} | ${product.rating.count}+ Sold
            </p>
            <p class="font-semibold mt-1">${product.title.split(' ').slice(0, 3).join(' ')}</p>
            <p class="text-[#006BB8] font-bold">
                ${formatRupiah(priceIDR)} 
                <span class="line-through text-gray-400 text-sm"><br> ${formatRupiah(originalPriceIDR)}</span>
            </p>
            <div class="flex items-center justify-between mt-2">
                <p class="text-sm text-gray-500 flex items-center">
                    <i class="fa-solid fa-location-dot mr-2" style="color: #00171f;"></i> 
                    ${location}
                </p>
                <button class="add-to-cart-btn mx-shadow text-black rounded text-sm cursor-pointer" data-id="${product.id}">
                <i class="fa-solid fa-cart-plus" style="color: #00171f;"></i>
                </button>
            </div>
        `;

        popularItem.addEventListener('click', () => {
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'detailProduct.html';
        });

        const addToCartBtn = popularItem.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            const existingIndex = cartItems.findIndex(item => item.id === product.id);
            if (existingIndex !== -1) {
                cartItems[existingIndex].quantity += 1;
            } else {
                cartItems.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    description: product.description,
                    quantity: 1
                });
            }
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            alert("Produk ditambahkan ke keranjang!");
        });

        popularContainer.appendChild(popularItem);
    });
}

async function loadPopularItems() {
    await fetchProducts();
    const initialProducts = allProducts.slice(5, productIndex);
    displayPopularItems(initialProducts);
}

// Carousel Navigation
function setupCarousel() {
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const flashSaleContainer = document.getElementById('flash-sale-container');
    
    if (!prevBtn || !nextBtn || !flashSaleContainer) return;

    let scrollPosition = 0;
    const scrollAmount = 300;

    prevBtn.addEventListener('click', () => {
        scrollPosition = Math.max(0, scrollPosition - scrollAmount);
        flashSaleContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        scrollPosition = Math.min(
            flashSaleContainer.scrollWidth - flashSaleContainer.clientWidth,
            scrollPosition + scrollAmount
        );
        flashSaleContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    });
}

function searchBar() {
    const searchInput = document.getElementById('searchBar');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));

        const popularContainer = document.getElementById('popular-container');
        if (!popularContainer) return;

        popularContainer.innerHTML = ''; // bersihkan tampilan
        displayPopularItems(filtered.slice(0, 15)); // tampilkan hasil pencarian
    });
}
    


// Initialize everything
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadFlashSale();
    await loadPopularItems();
    setupCarousel();
    searchBar();
    const profileBtn = document.getElementById('profile-btn');
    const dropdown = document.getElementById('dropdown');

    const moreBtn = document.getElementById('load-more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            const nextProducts = allProducts.slice(productIndex, productIndex + 5);
            displayPopularItems(nextProducts);
            productIndex += 5;

            if (productIndex >= allProducts.length) {
                moreBtn.disabled = true;
                
            }
        });
    }
     profileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Biar gak langsung ketutup
        dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
        const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        // Logika logout: hapus token, redirect, dll
        alert("Logged out!"); // sementara pakai alert
        // contoh redirect ke halaman login:
        window.location.href = "../html/index.html";
    });
});

function getNextTargetDate() {
  const now = new Date();
  //reset setiap hari jam 23:59:59
  const target = new Date(now);
  target.setHours(24, 59, 59, 999);

  // Kalau sudah lewat target hari ini, set ke besok
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}

let targetDate = getNextTargetDate();


function updateCountdown() {
  const now = new Date().getTime();
  let distance = targetDate - now;

  if (distance <= 0) {
    targetDate = getNextTargetDate();
    distance = targetDate - now; // hitung ulang jaraknya
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
}

updateCountdown();

setInterval(updateCountdown, 1000);