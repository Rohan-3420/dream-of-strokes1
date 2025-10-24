// Admin Panel JavaScript
const ADMIN_PASSWORD = 'Opensimsim';
const PRODUCTS_FILE = 'products.json';

// Check if user is logged in
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
  if (isLoggedIn === 'true') {
    showDashboard();
    loadProducts();
  }
}

// Login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const password = document.getElementById('password-input').value;
  const errorMsg = document.getElementById('login-error');
  
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    errorMsg.textContent = '';
    showDashboard();
    loadProducts();
  } else {
    errorMsg.textContent = 'Incorrect password. Please try again.';
    document.getElementById('password-input').value = '';
  }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
  }
});

// Show dashboard
function showDashboard() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'block';
}

// Load products from localStorage (simulating backend)
function loadProducts() {
  let products = getProducts();
  displayProducts(products);
}

// Get products from localStorage
function getProducts() {
  const stored = localStorage.getItem('dreamProducts');
  if (stored) {
    return JSON.parse(stored);
  }
  // Initial products
  return [
    {
      id: 1,
      title: "Arabic Calligraphy (Black & White)",
      artist: "Rohan Shahzad",
      artistContact: "923354581567",
      price: "50,000.00",
      category: "Calligraphy",
      image: "images/products/rohan c1 (copy).jpeg",
      description: "An elegant acrylic painting that showcases the beauty of Arabic script through bold black and white strokes. The artwork highlights the rhythm and flow of traditional calligraphy, creating a stunning visual statement that celebrates Islamic art and cultural heritage.",
      featured: true
    },
    {
      id: 2,
      title: "Islamic Calligraphy Canvas",
      artist: "Rohan Shahzad",
      artistContact: "923354581567",
      price: "45,000.00",
      category: "Calligraphy",
      image: "images/products/rohan c2 (copy).jpeg",
      description: "A beautiful Islamic calligraphy piece featuring intricate Arabic script on canvas. This artwork combines traditional calligraphic techniques with contemporary styling.",
      featured: true
    },
    {
      id: 3,
      title: "Colorful Calligraphy Art",
      artist: "Fasih-ur-Rehman",
      artistContact: "923158773306",
      price: "40,000.00",
      category: "Calligraphy",
      image: "images/products/fasih c1.png",
      description: "A stunning display of Arabic calligraphy expertise. This piece showcases the artistic beauty of Islamic script with precision and elegance.",
      featured: false
    },
    {
      id: 4,
      title: "Still Life Composition",
      artist: "Ahmad Abbas",
      artistContact: "923279784423",
      price: "35,000.00",
      category: "Still Life",
      image: "images/products/ahmad s1.png",
      description: "A classic still life painting featuring everyday objects arranged with artistic precision. The use of light and shadow creates depth and dimension.",
      featured: false
    }
  ];
}

// Save products to localStorage
function saveProducts(products) {
  localStorage.setItem('dreamProducts', JSON.stringify(products));
}

// Display products
function displayProducts(products) {
  const container = document.getElementById('products-list');
  const countElement = document.getElementById('product-count');
  
  countElement.textContent = products.length;
  
  if (products.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No products added yet. Add your first product above!</p>';
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-card" style="position: relative;">
      ${product.featured ? '<div class="featured-badge"><i class="fa-solid fa-star"></i> Featured</div>' : ''}
      <img src="${product.image}" alt="${product.title}" class="product-card-image" onerror="this.src='images/logo/nav.png'">
      <div class="product-card-content">
        <div class="product-card-header">
          <div>
            <h3 class="product-card-title">${product.title}</h3>
            <p class="product-card-artist">${product.artist}</p>
          </div>
          <p class="product-card-price">Rs. ${product.price}</p>
        </div>
        <span class="product-card-category">${product.category}</span>
        <p class="product-card-description">${product.description}</p>
        <div class="product-card-actions">
          <button onclick="viewProduct(${product.id})" class="btn btn-secondary btn-small">
            <i class="fa-solid fa-eye"></i> View
          </button>
          <button onclick="deleteProduct(${product.id})" class="btn btn-danger btn-small">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Add product
document.getElementById('product-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const artistData = document.getElementById('product-artist').value.split('|');
  
  const newProduct = {
    id: Date.now(),
    title: document.getElementById('product-title').value,
    artist: artistData[0],
    artistContact: artistData[1],
    price: document.getElementById('product-price').value,
    category: document.getElementById('product-category').value,
    image: document.getElementById('product-image').value,
    description: document.getElementById('product-description').value,
    featured: document.getElementById('product-featured').checked
  };
  
  let products = getProducts();
  products.push(newProduct);
  saveProducts(products);
  
  displayProducts(products);
  this.reset();
  
  alert('Product added successfully! ✅');
  
  // Scroll to products list
  document.getElementById('products-list').scrollIntoView({ behavior: 'smooth' });
});

// Delete product
function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    displayProducts(products);
    alert('Product deleted successfully! ✅');
  }
}

// View product
function viewProduct(id) {
  window.open(`product.html?id=${id}`, '_blank');
}

// Initialize
checkAuth();

