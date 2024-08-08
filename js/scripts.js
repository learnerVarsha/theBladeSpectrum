const TAX_RATE = 0.13; // 13% tax rate
document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('products', JSON.stringify(data));
            displayProducts(data);
            loadCart();
            loadWishlist();
            showProductDetailsIfNeeded();
        })
        .catch(error => console.error('Error fetching products:', error));

    document.getElementById('cart-button').addEventListener('click', () => showSection('cart'));
    document.getElementById('home-button').addEventListener('click', () => showSection('product-list'));
    document.getElementById('wishlist-button').addEventListener('click', () => showSection('wishlist'));
});

const displayProducts = (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear any existing products
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        // Define isInWishlist variable to check if the product is in the wishlist
        const isInWishlist = wishlist.some(item => item.id === product.id);

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">Price: 
            <strong>$${product.salePrice.toFixed(2)}</strong>
            <del>$${product.mrp.toFixed(2)}</del></p>
            <button onclick="viewProductDetails(${product.id})">View Details</button>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="addToWishlist(${product.id})" 
                ${isInWishlist ? 'disabled' : ''}>${isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}</button>
        `;
        productList.appendChild(productDiv);
    });
};


const viewProductDetails = (id) => {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === id);
    if (product) {
        const detailsSection = document.getElementById('product-details');
        detailsSection.innerHTML = `
            <button onclick="showSection('product-list')">Back to Products</button>
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">Price: 
            <strong>$${product.salePrice.toFixed(2)}</strong>
            <del>$${product.mrp.toFixed(2)}</del></p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="addToWishlist(${product.id})">Add to Wishlist</button>
        `;
        showSection('product-details');
    }
};

const showSection = (sectionId) => {
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = section.id === sectionId ? 'grid' : 'none';
    });

    // Show or hide buttons based on the section being displayed
    document.getElementById('home-button').style.display = sectionId === 'product-list' ? 'none' : 'grid';
    document.getElementById('cart-button').style.display = sectionId === 'cart' ? 'none' : 'block';
    document.getElementById('wishlist-button').style.display = sectionId === 'wishlist' ? 'none' : 'block';
};

const showProductDetailsIfNeeded = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);
    if (productId) {
        viewProductDetails(productId);
    } else {
        showSection('product-list');
    }
};

const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay(cart);
    updateCartCount(cart);
};

const loadWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateWishlistDisplay(wishlist);
};

const addToCart = (id) => {
    const products = JSON.parse(localStorage.getItem('products'));
    if (!products) {
        console.error('Products not found in local storage.');
        return;
    }
    const product = products.find(p => p.id === id);
    if (!product) {
        console.error('Product not found.');
        return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
    updateCartCount(cart);
};

const addToWishlist = (id) => {
    const products = JSON.parse(localStorage.getItem('products'));
    if (!products) {
        console.error('Products not found in local storage.');
        return;
    }
    const product = products.find(p => p.id === id);
    if (!product) {
        console.error('Product not found.');
        return;
    }
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.find(item => item.id === id)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistDisplay(wishlist);

         // Change button text to "Added to Wishlist"
         const addButton = document.querySelector(`button[onclick="addToWishlist(${id})"]`);
         addButton.innerText = "Added to Wishlist";
         addButton.disabled = true; // Optionally disable the button after adding
    }
};

const updateCartCount = (cart) => {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
};

const updateCartDisplay = (cart) => {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    let totalPrice = 0;
    let totalTax = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        const oneItemTax = item.salePrice * TAX_RATE;
        const oneItemTotal = item.salePrice + oneItemTax;
        const itemTotal = oneItemTotal * item.quantity;
        const itemTax = oneItemTax * item.quantity;
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.salePrice.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                <button onclick="removeFromCart(${item.id})">Remove</button>
                <button onclick="moveToWishlist(${item.id})">Move to Wishlist</button>
            </div>
        `;
        cartList.appendChild(cartItem);
        totalPrice += itemTotal;
        totalTax += itemTax;
    });

    document.getElementById('total-price').innerText = totalPrice.toFixed(2);
    document.getElementById('total-tax').innerText = totalTax.toFixed(2);
    document.getElementById('complete-total').innerText = (totalPrice + totalTax).toFixed(2);
};

const updateWishlistDisplay = (wishlist) => {
    const wishlistList = document.getElementById('wishlist-list');
    wishlistList.innerHTML = '';

    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.classList.add('product');
        wishlistItem.innerHTML = `
            <div>
                <img src="${item.image}" alt="${item.name}" style="width:100px;height:100px;object-fit:cover;">
                <h4>${item.name}</h4>
                <p>$${item.salePrice.toFixed(2)}</p>
                <button onclick="viewProductDetails(${item.id})">View Details</button>
                <button onclick="addToCart(${item.id})">Add to Cart</button>
                <button onclick="removeFromWishlist(${item.id})">Remove</button>
            </div>
        `;
        wishlistList.appendChild(wishlistItem);
    });
};


const updateQuantity = (id, quantity) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity = parseInt(quantity, 10);
        if (cartItem.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay(cart);
            updateCartCount(cart);
        }
    }
};

const removeFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
    updateCartCount(cart);
};

const moveToWishlist = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === id);
    if (item) {
        removeFromCart(id);
        addToWishlist(id);
    }
};

const removeFromWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay(wishlist);

    // Change button text back to "Add to Wishlist"
    const addButton = document.querySelector(`button[onclick="addToWishlist(${id})"]`);
    if (addButton) {
        addButton.innerText = "Add to Wishlist";
        addButton.disabled = false; // Re-enable the button
    }
};

document.getElementById('checkout').addEventListener('click', () => {
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    updateCartDisplay([]);
    showSection('product-list'); // Go back to the product list after checkout
});
