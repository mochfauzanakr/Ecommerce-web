document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.getElementById('order-list');
  const totalBill = document.getElementById('total-bill');

  let shippingCost = parseInt(localStorage.getItem('shippingCost')) || 0;

  function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('checkoutItems', 'cartItems')) || [];
    orderList.innerHTML = '';
    let total = 0;

    cartItems.forEach(item => {
      const itemTotal = item.price *16000* item.quantity;
      total += itemTotal;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'bg-white rounded p-4 border flex justify-between items-center';

      itemDiv.innerHTML = `
      <div class="flex items-start gap-4 w-full">
        <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-cover rounded" />
        <div class="flex flex-col justify-between w-full">
          <div class="font-semibold">${item.title}</div>
        </div>
        <div class="ml-auto flex flex-col items-end gap-2">
          <div class="flex items-center gap-1 border rounded px-2 py-1">
            <button class="decrease px-2">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="increase px-2">+</button>
          </div>
            <button class="delete-btn text-red-600 hover:text-red-800" data-id="${item.id}">
            <i class="fa-solid fa-trash" style="color: #00171f;"></i>
            </button>
          <div class="font-semibold text-sm mt-1">Rp ${(item.price *16000* item.quantity).toLocaleString('id-ID')}</div>
        </div>
      </div>
      `;
      const increase = itemDiv.querySelector(".increase");
      const decrease = itemDiv.querySelector(".decrease");
      const quantityEl = itemDiv.querySelector(".quantity");

      increase.addEventListener("click", () => {
        item.quantity++;
        quantityEl.textContent = item.quantity;
        updateCartItem(item.id, item.quantity);
      });

      decrease.addEventListener("click", () => {
        if (item.quantity > 1) {
        item.quantity--;
        quantityEl.textContent = item.quantity;
        updateCartItem(item.id, item.quantity);
      }
    });

      orderList.appendChild(itemDiv);
    });

    totalBill.textContent = `Rp ${ (total + shippingCost).toLocaleString('id-ID') }`;

    setupDeleteButtons();
  }

  function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        let cartItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
        loadCartItems();
      });
    });
  }

  function updateCartItem(id, newQuantity) {
  const cartItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];
  const index = cartItems.findIndex(item => item.id === id);
  if (index !== -1) {
    cartItems[index].quantity = newQuantity;
    cartItems[index].lastUpdated = new Date().toISOString();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCartItems();
  }
}


  // Delivery dropdown behavior
  const deliveryToggle = document.getElementById('delivery-toggle');
  const deliveryOptions = document.getElementById('delivery-options');
  const selectedDelivery = document.getElementById('selected-delivery');
  const deliveryName = document.getElementById('delivery-name');
  const deliveryEstimate = document.getElementById('delivery-estimate');
  const deliveryIcon = document.getElementById('delivery-icon');

  const shippingPrices = {
    hemat: 15000,
    reguler: 20000,
    express: 30000,
    instan: 50000
  };

  const iconMap = {
    hemat: ['fa-leaf', 'Hemat', '(4-5 Hari) - Rp 15.000'],
    reguler: ['fa-box', 'Reguler', '(2-4 Hari) - Rp 20.000'],
    express: ['fa-bolt', 'Ekspres', '(1-2 Hari) - Rp 30.000'],
    instan: ['fa-motorcycle', 'Instan', '(< 3 Jam) - Rp 50.000']
  };

  deliveryToggle.addEventListener('click', () => {
    deliveryOptions.classList.toggle('hidden');
  });

  document.querySelectorAll('.delivery-option').forEach(option => {
    option.addEventListener('click', () => {
      const value = option.getAttribute('data-value');
      const [iconClass, name, estimate] = iconMap[value];


      
  shippingCost = shippingPrices[value];
  localStorage.setItem('shippingCost', shippingCost);
  localStorage.setItem('deliveryType', value);

      shippingCost = shippingPrices[value];
      loadCartItems();
      deliveryIcon.className = `fa-solid ${iconClass} text-xl mr-3`;
      deliveryName.textContent = name;
      deliveryEstimate.textContent = estimate;

      selectedDelivery.classList.remove('hidden');
      deliveryOptions.classList.add('hidden');
    });
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    alert('produk berhasil di pesan');
    window.location.href = "../html/homePage.html";
    localStorage.removeItem('cartItems');
    loadCartItems();
    totalBill.textContent = 'Rp 0';
  });

  loadCartItems();
});