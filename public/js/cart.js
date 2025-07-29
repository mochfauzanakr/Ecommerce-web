document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const selectAll = document.getElementById("select-all");

  function formatRupiah(amount) {
    return `Rp ${(amount * 16000).toLocaleString("id-ID")}`;
  }

  function updateTotalPrice() {
    const cartItems = document.querySelectorAll(".cart-item");
    let total = 0;
    cartItems.forEach(item => {
      const checkbox = item.querySelector(".item-checkbox");
      if (checkbox.checked) {
        const qty = parseInt(item.querySelector(".quantity").textContent);
        const price = parseFloat(item.dataset.price);
        total += qty * price;
      }
    });
    totalPriceEl.textContent = formatRupiah(total);
  }

  function updateLastUpdatedDisplay() {
  const lastUpdatedEl = document.getElementById("last-updated");

  const updatedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];


  const timestamps = updatedCartItems
    .map(item => item.lastUpdated)
    .filter(Boolean)
    .map(ts => new Date(ts));

  if (timestamps.length === 0) {
    lastUpdatedEl.textContent = "Terakhir diubah: ";
    return;
  }


  const latest = new Date(Math.max(...timestamps));
  const formatted = latest.toLocaleString("id-ID");

  lastUpdatedEl.textContent = `Terakhir diubah: ${formatted}`;
}

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  function createCartItem(product) {
    const item = document.createElement("div");
    item.className = "border rounded p-4 flex items-start gap-4 cart-item";
    item.dataset.price = product.price;

    item.innerHTML = `
      <input type="checkbox" class="item-checkbox mt-2" checked>
      <div class="flex flex-col">
        <div class="flex items-center gap-4 mt-2">
          <img src="${product.image}" width="40" class="w-20 h-20 object-cover rounded" />
          <div>
            <div class="font-medium">${product.title}</div>
          </div>
        </div>
      </div>
      <div class="ml-auto flex flex-col items-end gap-2">
        <div class="font-semibold">${formatRupiah(product.price)}</div>
        <div class="flex items-center gap-2">
          <button class="delete-btn">
          <i class="fa-solid fa-trash" style="color: #00171f;"></i>
          </button>
          <div class="flex items-center gap-1 border rounded px-2 py-1">
            <button class="decrease px-2">-</button>
            <span class="quantity">${product.quantity}</span>
            <button class="increase px-2">+</button>
          </div>
        </div>
      </div>
    `;

    const increase = item.querySelector(".increase");
    const decrease = item.querySelector(".decrease");
    const quantityEl = item.querySelector(".quantity");
    const checkbox = item.querySelector(".item-checkbox");
    const deleteBtn = item.querySelector(".delete-btn");

    increase.addEventListener("click", () => {
      let qty = parseInt(quantityEl.textContent) + 1;
      quantityEl.textContent = qty;

      const index = cartItems.findIndex(p => p.id === product.id);
      if (index !== -1) {
        cartItems[index].quantity = qty;
        cartItems[index].lastUpdated = new Date().toISOString();
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      }

      updateTotalPrice();
      updateLastUpdatedDisplay();
    });

    decrease.addEventListener("click", () => {
      let qty = parseInt(quantityEl.textContent);
      if (qty > 1) {
        qty--;
        quantityEl.textContent = qty;

        const index = cartItems.findIndex(p => p.id === product.id);
        if (index !== -1) {
          cartItems[index].quantity = qty;
          cartItems[index].lastUpdated = new Date().toISOString();
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }

        updateTotalPrice();
        updateLastUpdatedDisplay();
      }
    });

    checkbox.addEventListener("change", updateTotalPrice);

    deleteBtn.addEventListener("click", () => {
      item.remove();

      const updatedCartItems = cartItems.filter(p => p.id !== product.id);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

      updateTotalPrice();
      updateLastUpdatedDisplay();
    });

    return item;
  }

  cartItems.forEach(product => {
    const cartItemEl = createCartItem(product);
    cartContainer.appendChild(cartItemEl);
  });

  updateLastUpdatedDisplay()

  selectAll.addEventListener("change", (e) => {
    const checked = e.target.checked;
    document.querySelectorAll(".item-checkbox").forEach(cb => {
      cb.checked = checked;
    });
    updateTotalPrice();
  });

  updateTotalPrice();
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
      window.location.href = "../html/checkout.html";
    });
  }
});