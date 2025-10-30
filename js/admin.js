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

// Get products from Supabase API
async function getProducts() {
  try {
    const response = await fetch('/api/get-products');
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

// Save all products to Supabase (bulk update)
async function saveProducts(products) {
  try {
    const response = await fetch('/api/save-products', {
      method: 'PUT',
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

// Save single product to Supabase
async function saveProduct(product) {
  try {
    const response = await fetch('/api/save-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save product');
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to save product');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error saving product:', error);
    alert('⚠️ Error saving product: ' + error.message);
    return null;
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
    id: editingProductId || Date.now(),
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
  
  let isEditing = editingProductId !== null;
  
  // Save single product to Supabase
  const saved = await saveProduct(productData);
  
  if (saved) {
    alert(isEditing ? 'Product updated successfully! ✅' : 'Product added successfully! ✅');
    
    // Reset editing state
    editingProductId = null;
    document.querySelector('.btn-primary').innerHTML = '<i class="fa-solid fa-plus"></i> Add Product';
    
    // Reload products from database
    const products = await getProducts();
    
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
    try {
      const response = await fetch('/api/save-products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete product');
      }
      
      // Reload products from database
      const products = await getProducts();
      displayProducts(products);
      alert('Product deleted successfully! ✅');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('⚠️ Error deleting product: ' + error.message);
    }
  }
}

// View product
function viewProduct(id) {
  window.open(`product.html?id=${id}`, '_blank');
}


// Image Upload Functionality
document.getElementById('upload-image-btn').addEventListener('click', function() {
  document.getElementById('product-image-file').click();
});

document.getElementById('product-image-file').addEventListener('change', async function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert('⚠️ Please select a valid image file (JPG, PNG, GIF, or WEBP)');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('⚠️ Image size must be less than 5MB');
    return;
  }
  
  const uploadStatus = document.getElementById('upload-status');
  uploadStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
  uploadStatus.style.color = '#1e90ff';
  
  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    
    // Upload to API
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }
    
    // Set image URL in input field
    document.getElementById('product-image').value = result.url;
    
    // Show preview
    const preview = document.getElementById('image-preview');
    const previewContainer = document.getElementById('image-preview-container');
    preview.src = result.url;
    previewContainer.style.display = 'block';
    
    uploadStatus.innerHTML = '<i class="fa-solid fa-check-circle"></i> Uploaded!';
    uploadStatus.style.color = '#28a745';
    
    setTimeout(() => {
      uploadStatus.innerHTML = '';
    }, 3000);
    
  } catch (error) {
    console.error('Error uploading image:', error);
    uploadStatus.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> Upload failed';
    uploadStatus.style.color = '#dc3545';
    alert('⚠️ Error uploading image: ' + error.message);
  }
});

// Initialize
checkAuth();

// Update category suggestions on load
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
  getProducts().then(products => {
    updateCategorySuggestions(products);
  });
}

