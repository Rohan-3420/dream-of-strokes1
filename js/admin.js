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

// Load products from JSON file
async function loadProducts() {
  let products = await getProducts();
  displayProducts(products);
}

// Get products from JSON file
async function getProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) {
      throw new Error('Failed to load products');
    }
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Save products to JSON file via backend
async function saveProducts(products) {
  try {
    const response = await fetch('save-products.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products: products })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save products');
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to save products');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    alert('⚠️ Error saving products: ' + error.message);
    return false;
  }
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
      ${product.sold ? '<div class="sold-badge-admin"><i class="fa-solid fa-circle-check"></i> SOLD</div>' : ''}
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
        ${product.sold ? '<span class="product-status sold">✅ SOLD</span>' : '<span class="product-status available">🟢 Available</span>'}
        <p class="product-card-description">${product.description}</p>
        <div class="product-card-actions">
          <button onclick="editProduct(${product.id})" class="btn btn-primary btn-small">
            <i class="fa-solid fa-edit"></i> Edit
          </button>
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

// Track edit mode
let editingProductId = null;

// Add or Update product
document.getElementById('product-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const productData = {
    title: document.getElementById('product-title').value,
    artist: document.getElementById('product-artist').value,
    artistContact: document.getElementById('product-contact').value,
    price: document.getElementById('product-price').value,
    category: document.getElementById('product-category').value,
    image: document.getElementById('product-image').value,
    description: document.getElementById('product-description').value,
    featured: document.getElementById('product-featured').checked,
    sold: document.getElementById('product-sold').checked
  };
  
  let products = await getProducts();
  let isEditing = editingProductId !== null;
  
  if (editingProductId) {
    // Update existing product
    const index = products.findIndex(p => p.id === editingProductId);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
    }
    editingProductId = null;
    document.querySelector('.btn-primary').innerHTML = '<i class="fa-solid fa-plus"></i> Add Product';
  } else {
    // Add new product
    const newProduct = {
      id: Date.now(),
      ...productData
    };
    products.push(newProduct);
  }
  
  const saved = await saveProducts(products);
  if (saved) {
    alert(isEditing ? 'Product updated successfully! ✅' : 'Product added successfully! ✅');
    
    // Update category suggestions
    updateCategorySuggestions(products);
    
    displayProducts(products);
    this.reset();
    
    // Scroll to products list
    document.getElementById('products-list').scrollIntoView({ behavior: 'smooth' });
  }
});

// Update category suggestions based on existing products
function updateCategorySuggestions(products) {
  const categories = [...new Set(products.map(p => p.category))];
  const datalist = document.getElementById('category-suggestions');
  datalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
}

// Edit product
async function editProduct(id) {
  const products = await getProducts();
  const product = products.find(p => p.id === id);
  
  if (!product) return;
  
  // Populate form with product data
  document.getElementById('product-title').value = product.title;
  document.getElementById('product-artist').value = product.artist;
  document.getElementById('product-contact').value = product.artistContact;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-image').value = product.image;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-featured').checked = product.featured || false;
  document.getElementById('product-sold').checked = product.sold || false;
  
  // Set edit mode
  editingProductId = id;
  document.querySelector('.btn-primary').innerHTML = '<i class="fa-solid fa-save"></i> Update Product';
  
  // Scroll to form
  document.getElementById('product-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Delete product
async function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    let products = await getProducts();
    products = products.filter(p => p.id !== id);
    const saved = await saveProducts(products);
    if (saved) {
      displayProducts(products);
      alert('Product deleted successfully! ✅');
    }
  }
}

// View product
function viewProduct(id) {
  window.open(`product.html?id=${id}`, '_blank');
}


// Initialize
checkAuth();

// Update category suggestions on load
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
  getProducts().then(products => {
    updateCategorySuggestions(products);
  });
}

