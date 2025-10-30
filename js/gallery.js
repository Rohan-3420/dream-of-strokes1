// Gallery Dynamic Product Loading

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

// Load gallery on artwork page
async function loadGallery(filterCategory = 'all', filterArtist = 'all') {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;
  
  let products = await getProducts();
  
  // Apply filters
  if (filterCategory !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());
  }
  
  if (filterArtist !== 'all') {
    products = products.filter(p => p.artist.toLowerCase() === filterArtist.toLowerCase());
  }
  
  if (products.length === 0) {
    galleryContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 60px 20px; grid-column: 1 / -1; font-size: 1.1rem;">No artworks match your filters. Try selecting different options.</p>';
    return;
  }
  
  galleryContainer.innerHTML = products.map(product => {
    // Get first image if multiple images are comma-separated
    const firstImage = product.image.split(',')[0].trim();
    
    return `
    <article class="art-card" 
             data-category="${product.category.toLowerCase().replace(/\s+/g, '-')}" 
             data-artist="${product.artist.toLowerCase().replace(/\s+/g, '-')}">
      <a href="product.html?id=${product.id}">
        <div class="card-image">
          <img src="${firstImage}" alt="${product.title}" loading="lazy">
          ${product.featured ? '<span class="card-badge">Featured</span>' : ''}
        </div>
        <div class="card-info">
          <span class="card-category">${product.category}</span>
          <h3>${product.title}</h3>
          <p class="card-artist">${product.artist}</p>
          <p class="card-price">Rs. ${product.price}</p>
        </div>
      </a>
    </article>
  `;
  }).join('');
}

// Generate filter buttons dynamically
async function generateFilters() {
  const products = await getProducts();
  
  // Get unique categories and artists
  const categories = [...new Set(products.map(p => p.category))];
  const artists = [...new Set(products.map(p => p.artist))];
  
  // Generate category buttons
  const categoryButtons = document.querySelector('[data-filter-type="category"] .filter-buttons');
  if (categoryButtons) {
    categoryButtons.innerHTML = `
      <button class="filter-btn active" data-filter="all">All</button>
      ${categories.map(cat => `
        <button class="filter-btn" data-filter="${cat.toLowerCase()}">${cat}</button>
      `).join('')}
    `;
  }
  
  // Generate artist buttons
  const artistButtons = document.querySelector('[data-filter-type="artist"] .filter-buttons');
  if (artistButtons) {
    artistButtons.innerHTML = `
      <button class="filter-btn active" data-filter="all">All</button>
      ${artists.map(artist => `
        <button class="filter-btn" data-filter="${artist.toLowerCase()}">${artist}</button>
      `).join('')}
    `;
  }
}

// Setup filter functionality
function setupFilters() {
  let activeCategory = 'all';
  let activeArtist = 'all';
  
  // Category filter
  const categoryFilters = document.querySelector('[data-filter-type="category"]');
  if (categoryFilters) {
    categoryFilters.addEventListener('click', function(e) {
      if (e.target.classList.contains('filter-btn')) {
        // Remove active class from siblings
        categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Update filter and reload gallery
        activeCategory = e.target.getAttribute('data-filter');
        loadGallery(activeCategory, activeArtist);
      }
    });
  }
  
  // Artist filter
  const artistFilters = document.querySelector('[data-filter-type="artist"]');
  if (artistFilters) {
    artistFilters.addEventListener('click', function(e) {
      if (e.target.classList.contains('filter-btn')) {
        // Remove active class from siblings
        artistFilters.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Update filter and reload gallery
        activeArtist = e.target.getAttribute('data-filter');
        loadGallery(activeCategory, activeArtist);
      }
    });
  }
}

// Load featured products on homepage
async function loadFeaturedProducts() {
  const featuredContainer = document.getElementById('featured-products');
  if (!featuredContainer) return;
  
  const products = await getProducts();
  const featured = products.filter(p => p.featured && !p.sold);
  
  // If no featured products, show all available products
  const displayProducts = featured.length > 0 ? featured : products.filter(p => !p.sold).slice(0, 8);
  
  if (displayProducts.length === 0) {
    featuredContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px; grid-column: 1 / -1;">No products available yet.</p>';
    return;
  }
  
  featuredContainer.innerHTML = displayProducts.map(product => {
    // Get first image if multiple images are comma-separated
    const firstImage = product.image.split(',')[0].trim();
    
    return `
    <div class="art-card">
      <a href="product.html?id=${product.id}">
        <img src="${firstImage}" alt="${product.title}" loading="lazy">
        <h3>${product.title}</h3>
        <p><strong>Rs. ${product.price}</strong><br>PKR</p>
      </a>
    </div>
  `;
  }).join('');
}

// Load sold products on homepage
async function loadSoldProducts() {
  const soldContainer = document.getElementById('sold-products');
  if (!soldContainer) return;
  
  const products = await getProducts();
  const sold = products.filter(p => p.sold).slice(0, 8);
  
  if (sold.length === 0) {
    // Hide the entire sold section if no sold products
    const soldSection = document.querySelector('.sold-section');
    if (soldSection) soldSection.style.display = 'none';
    return;
  }
  
  soldContainer.innerHTML = sold.map(product => {
    // Get first image if multiple images are comma-separated
    const firstImage = product.image.split(',')[0].trim();
    
    return `
    <article class="art-card sold-card">
      <div class="sold-overlay">
        <span class="sold-badge">SOLD</span>
      </div>
      <div class="card-image">
        <img src="${firstImage}" alt="${product.title}" loading="lazy">
      </div>
      <div class="card-info">
        <span class="card-category">${product.category}</span>
        <h3>${product.title}</h3>
        <p class="card-artist">${product.artist}</p>
        <p class="card-price">Rs. ${product.price}</p>
      </div>
    </article>
  `;
  }).join('');
}


// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  // Generate filters first, then load gallery
  if (document.getElementById('gallery-container')) {
    await generateFilters();
    setupFilters();
    await loadGallery();
  }
  
  // Load featured products on homepage
  await loadFeaturedProducts();
  
  // Load sold products on homepage
  await loadSoldProducts();
});

