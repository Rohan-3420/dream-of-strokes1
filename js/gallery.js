// Gallery Dynamic Product Loading

// Get products from localStorage
function getProducts() {
  const stored = localStorage.getItem('dreamProducts');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default products
  const defaultProducts = [
    {
      id: 1,
      title: "Arabic Calligraphy (Black & White)",
      artist: "Rohan Shahzad",
      artistContact: "923354581567",
      price: "50,000.00",
      category: "Calligraphy",
      image: "images/products/rohan c1 (copy).jpeg",
      description: "An elegant acrylic painting that showcases the beauty of Arabic script through bold black and white strokes.",
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
      description: "A beautiful Islamic calligraphy piece featuring intricate Arabic script on canvas.",
      featured: true
    },
    {
      id: 3,
      title: "Colorful Calligraphy",
      artist: "Fasih-ur-Rehman",
      artistContact: "923158773306",
      price: "40,000.00",
      category: "Calligraphy",
      image: "images/products/fasih c1.png",
      description: "A stunning display of Arabic calligraphy expertise with vibrant colors.",
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
      description: "A classic still life painting featuring everyday objects.",
      featured: false
    }
  ];
  localStorage.setItem('dreamProducts', JSON.stringify(defaultProducts));
  return defaultProducts;
}

// Load gallery on artwork page
function loadGallery() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;
  
  const products = getProducts();
  
  if (products.length === 0) {
    galleryContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 60px 20px; grid-column: 1 / -1;">No artworks available at the moment.</p>';
    return;
  }
  
  galleryContainer.innerHTML = products.map(product => `
    <article class="art-card" data-category="${product.category.toLowerCase().replace(' ', '-')}">
      <a href="product.html?id=${product.id}">
        <div class="card-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
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
  `).join('');
}

// Load featured products on homepage
function loadFeaturedProducts() {
  const featuredContainer = document.getElementById('featured-products');
  if (!featuredContainer) return;
  
  const products = getProducts();
  const featured = products.filter(p => p.featured).slice(0, 4);
  
  if (featured.length === 0) return;
  
  featuredContainer.innerHTML = featured.map(product => `
    <article class="art-card">
      <a href="product.html?id=${product.id}">
        <div class="card-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
          <span class="card-badge">Featured</span>
        </div>
        <div class="card-info">
          <span class="card-category">${product.category}</span>
          <h3>${product.title}</h3>
          <p class="card-artist">${product.artist}</p>
          <p class="card-price">Rs. ${product.price}</p>
        </div>
      </a>
    </article>
  `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadGallery();
  loadFeaturedProducts();
});

