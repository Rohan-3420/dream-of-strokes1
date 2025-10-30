// Dynamic Product Page JavaScript

// Get product ID from URL
function getProductId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
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

// Load product
async function loadProduct() {
  const productId = getProductId();
  
  if (!productId) {
    showNotFound();
    return;
  }
  
  const products = await getProducts();
  const product = products.find(p => p.id == productId);
  
  if (!product) {
    showNotFound();
    return;
  }
  
  displayProduct(product);
  await loadRelatedProducts(product.category, product.id);
}

// Gallery state
let currentImageIndex = 0;
let productImages = [];

// Display product
function displayProduct(product) {
  // Hide loading, show product
  document.getElementById('product-loading').style.display = 'none';
  document.getElementById('product-section').style.display = 'block';
  
  // Update page title
  document.title = `${product.title} - Dream of Strokes`;
  
  // Parse images (comma-separated URLs)
  productImages = product.image.split(',').map(url => url.trim()).filter(url => url);
  currentImageIndex = 0;
  
  // Update product details
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('product-artist-name').textContent = product.artist;
  document.getElementById('product-price').textContent = `Rs. ${product.price} PKR`;
  document.getElementById('product-description').textContent = product.description;
  document.getElementById('product-category-badge').textContent = product.category;
  
  // Show featured badge
  if (product.featured) {
    document.getElementById('product-featured-badge').style.display = 'inline-flex';
  }
  
  // Setup image gallery
  setupImageGallery();
  
  // WhatsApp link
  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in the "${product.title}" painting. Can you provide more details?`);
  const whatsappLink = `https://wa.me/${product.artistContact}?text=${whatsappMsg}`;
  document.getElementById('whatsapp-link').href = whatsappLink;
  
  // Share links
  const pageUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Check out this beautiful artwork: ${product.title} by ${product.artist}`);
  
  document.getElementById('share-whatsapp').href = `https://wa.me/?text=${shareText}%20${pageUrl}`;
  document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
  
  // Image zoom
  document.getElementById('product-image').addEventListener('click', function() {
    window.open(this.src, '_blank');
  });
}

// Setup image gallery
function setupImageGallery() {
  const mainImage = document.getElementById('product-image');
  const thumbnailsContainer = document.getElementById('image-thumbnails');
  const prevBtn = document.getElementById('prev-image');
  const nextBtn = document.getElementById('next-image');
  
  // Display first image
  updateMainImage();
  
  // If multiple images, show gallery controls
  if (productImages.length > 1) {
    // Show navigation buttons
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    
    // Show thumbnails
    thumbnailsContainer.style.display = 'flex';
    
    // Create thumbnails
    thumbnailsContainer.innerHTML = productImages.map((url, index) => `
      <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
        <img src="${url}" alt="Image ${index + 1}">
      </div>
    `).join('');
    
    // Add thumbnail click handlers
    thumbnailsContainer.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', function() {
        currentImageIndex = parseInt(this.dataset.index);
        updateMainImage();
        updateThumbnails();
      });
    });
    
    // Add navigation handlers
    prevBtn.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
      updateMainImage();
      updateThumbnails();
    });
    
    nextBtn.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex + 1) % productImages.length;
      updateMainImage();
      updateThumbnails();
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
  }
}

// Update main image
function updateMainImage() {
  const mainImage = document.getElementById('product-image');
  mainImage.src = productImages[currentImageIndex];
  mainImage.alt = `Product image ${currentImageIndex + 1}`;
}

// Update thumbnail active state
function updateThumbnails() {
  document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentImageIndex);
  });
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
  if (productImages.length <= 1) return;
  
  if (e.key === 'ArrowLeft') {
    document.getElementById('prev-image').click();
  } else if (e.key === 'ArrowRight') {
    document.getElementById('next-image').click();
  }
}

// Show not found
function showNotFound() {
  document.getElementById('product-loading').style.display = 'none';
  document.getElementById('product-not-found').style.display = 'flex';
}

// Load related products
async function loadRelatedProducts(category, currentId) {
  const products = await getProducts();
  const related = products.filter(p => p.category === category && p.id != currentId).slice(0, 3);
  
  if (related.length === 0) {
    return;
  }
  
  document.getElementById('related-products').style.display = 'block';
  
  const grid = document.getElementById('related-products-grid');
  grid.innerHTML = related.map(product => `
    <a href="product.html?id=${product.id}" class="related-card">
      <img src="${product.image}" alt="${product.title}">
      <div class="related-card-content">
        <h3>${product.title}</h3>
        <p class="related-artist">${product.artist}</p>
        <p class="related-price">Rs. ${product.price}</p>
      </div>
    </a>
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProduct);

