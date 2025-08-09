function updateCartCount() {
    document.querySelectorAll('#cart-count').forEach(el => {
        el.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTotal', getCartTotal());
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartCount();
}

function loadCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    container.innerHTML = '';
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-white p-4 rounded shadow';
        div.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="removeFromCart(${index})">Remove</button>
        `;
        container.appendChild(div);
    });
    document.getElementById('cart-total').innerText = getCartTotal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    loadCart();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadCart();
});
