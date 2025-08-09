/* ======== CART STATE ======== */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/* ======== HELPERS ======== */
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartModal();
}

function updateQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) removeFromCart(index);
  else {
    saveCart();
    renderCartModal();
  }
}

function renderCartModal() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  
  if (!container) return;

  container.innerHTML = '';
  let subtotal = 0;

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500">Your cart is empty.</p>`;
    totalEl.textContent = "0.00";
    return;
  }

  cart.forEach((item, index) => {
    const price = Number(item.price) || 0;
    subtotal += price * item.quantity;
    container.innerHTML += `
      <div class="flex items-center justify-between border-b border-gray-200 py-3">
        <div class="flex items-center space-x-4">
          <img src="${item.image || 'https://placehold.co/64'}" alt="${item.name}" class="w-16 h-16 rounded object-cover">
          <div>
            <p class="font-semibold">${item.name}</p>
            <p class="text-sm text-gray-500">$${price.toFixed(2)} each</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-2 py-1 bg-gray-200 rounded" onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="px-2 py-1 bg-gray-200 rounded" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <button class="text-red-500 hover:underline" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });
  

  totalEl.textContent = subtotal.toFixed(2);
}

function addToCart(product) {
  if (!product || !product.name || typeof product.price !== "number") {
    console.error("Invalid product data", product);
    return;
  }

  const existingIndex = cart.findIndex(item => item.name === product.name);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += product.quantity || 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      image: product.image || "",
      quantity: product.quantity || 1
    });
  }
  saveCart();
}

/* ======== MODAL HANDLERS ======== */
function openCartModal() {
  document.getElementById('cart-modal').classList.remove('hidden');
  renderCartModal();
}

function closeCartModal() {
  document.getElementById('cart-modal').classList.add('hidden');
}

/* ======== INIT ======== */
document.addEventListener('DOMContentLoaded', updateCartCount);