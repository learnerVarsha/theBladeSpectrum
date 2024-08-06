document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('products', JSON.stringify(data));
            displayProducts(data);
            loadCart();
            loadWishlist();
        })
        .catch(error => console.error('Error fetching products:', error));

    document.getElementById('cart-button').addEventListener('click', toggleCart);
    document.getElementById('wishlist-button').addEventListener('click', toggleWishlist);
    document.getElementById('home-button').addEventListener('click', toggleHomePage);
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('products', JSON.stringify(data));
            displayProducts(data);
            loadCart();
            loadWishlist();
        })
        .catch(error => console.error('Error fetching products:', error));

    document.getElementById('cart-button').addEventListener('click', toggleCart);
    document.getElementById('wishlist-button').addEventListener('click', toggleWishlist);
    document.getElementById('home-button').addEventListener('click', toggleHomePage);
});

const toggleCart = () => {
    const cartSection = document.getElementById('cart');
    const productList = document.getElementById('product-list');
    const wishlistSection = document.getElementById('wishlist');
    const cartButton = document.getElementById('cart-button');
    const wishlistButton = document.getElementById('wishlist-button');
    const homeButton = document.getElementById('home-button');

    if (cartSection.style.display === 'none') {
        cartSection.style.display = 'block';
        productList.style.display = 'none';
        wishlistSection.style.display = 'none';
        cartButton.style.display = 'none';
        wishlistButton.style.display = 'block';
        homeButton.style.display = 'block';
    } else {
        cartSection.style.display = 'none';
        productList.style.display = 'block';
        wishlistButton.style.display = 'block';
        homeButton.style.display = 'none';
    }
};

const toggleWishlist = () => {
    const cartSection = document.getElementById('cart');
    const productList = document.getElementById('product-list');
    const wishlistSection = document.getElementById('wishlist');
    const cartButton = document.getElementById('cart-button');
    const wishlistButton = document.getElementById('wishlist-button');
    const homeButton = document.getElementById('home-button');

    if (wishlistSection.style.display === 'none') {
        wishlistSection.style.display = 'block';
        productList.style.display = 'none';
        cartSection.style.display = 'none';
        wishlistButton.style.display = 'none';
        cartButton.style.display = 'block';
        homeButton.style.display = 'block';
    } else {
        wishlistSection.style.display = 'none';
        productList.style.display = 'block';
        cartButton.style.display = 'block';
        homeButton.style.display = 'none';
    }
};

const toggleHomePage = () => {
    const cartSection = document.getElementById('cart');
    const productList = document.getElementById('product-list');
    const wishlistSection = document.getElementById('wishlist');
    const cartButton = document.getElementById('cart-button');
    const wishlistButton = document.getElementById('wishlist-button');
    const homeButton = document.getElementById('home-button');

    cartSection.style.display = 'none';
    wishlistSection.style.display = 'none';
    productList.style.display = 'block';
    cartButton.style.display = 'block';
    wishlistButton.style.display = 'block';
    homeButton.style.display = 'none';
};


const TAX_RATE = 0.13; // 13% tax rate

const displayProducts = (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear any existing products
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>MRP: $${product.mrp.toFixed(2)}</p>
                <p>Sale Price: $${product.salePrice.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
                <button onclick="addToWishlist(${product.id})">Add to Wishlist</button>
            </div>
        `;
        productList.appendChild(productDiv);
    });
};

const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay(cart);
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
    const wishlistItem = wishlist.find(item => item.id === id);
    if (!wishlistItem) {
        wishlist.push({ ...product });
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay(wishlist);
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
        wishlistItem.classList.add('wishlist-item');
        wishlistItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.salePrice.toFixed(2)}</p>
                <button onclick="removeFromWishlist(${item.id})">Remove</button>
                <button onclick="moveToCart(${item.id})">Move to Cart</button>
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
        }
    }
};

const removeFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
};

const removeFromWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay(wishlist);
};

const moveToWishlist = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === id);
    if (item) {
        addToWishlist(item.id);
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay(cart);
    }
};

const moveToCart = (id) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const item = wishlist.find(item => item.id === id);
    if (item) {
        addToCart(item.id);
        wishlist = wishlist.filter(item => item.id !== id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistDisplay(wishlist);
    }
};

document.getElementById('checkout').addEventListener('click', () => {
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    updateCartDisplay([]);
    toggleCart(); // Go back to the product list after checkout
});
