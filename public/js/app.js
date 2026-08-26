/**
 * FreshMart Grocery E-Commerce Application Logic
 * Comprehensive quick-commerce features (Carousel, Category Grid, Stepper, Cart Drawer, Modals)
 */

// Application State Store
const state = {
  products: [],
  categories: [],
  activeCategory: 'All',
  activeSubCategory: 'All',
  searchQuery: '',
  sortBy: 'featured',
  carouselIndex: 0,
  carouselTimer: null,
  cart: {
    items: [],
    subtotal: 0,
    totalItems: 0,
    deliveryFee: 0,
    tax: 0,
    discount: 0,
    total: 0,
    appliedCoupon: null,
  },
  user: JSON.parse(localStorage.getItem('freshmart_user') || 'null'),
  currentLocation: localStorage.getItem('freshmart_location') || 'Koramangala, Bengaluru (560034)',
  isLoading: false,
};

// Category Icon Mapping
const categoryIcons = {
  'All': '🛍️',
  'Vegetables & Fruits': '🥦',
  'Dairy, Bread & Eggs': '🥛',
  'Munchies / Snacks': '🍟',
  'Cold Drinks & Juices': '🥤',
  'Instant & Frozen Food': '🍜',
  'Tea, Coffee & Health Drinks': '☕',
  'Bakery & Biscuits': '🍪',
  'Sweet Tooth': '🍫',
  'Atta, Rice & Dal': '🌾',
  'Dry Fruits, Masala & Oil': '🧂',
  'Chicken, Meat & Fish': '🍗',
  'Organic & Gourmet': '🥗',
  'Baby Care': '👶',
  'Pharma & Wellness': '💊',
  'Cleaning Essentials': '🧹',
  'Personal Care': '🧴',
  'Beauty & Cosmetics': '💄',
  'Kitchen & Dining': '🍳',
  'Electronics & Electricals': '📱',
  'Stationery': '📚',
  'Sports, Fitness & Outdoors': '🏋️',
};

// DOM References
const DOM = {
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  categoriesContainer: document.getElementById('categoriesContainer'),
  homepageCategoryGrid: document.getElementById('homepageCategoryGrid'),
  subcategoriesBar: document.getElementById('subcategoriesBar'),
  subcategoriesList: document.getElementById('subcategoriesList'),
  productGrid: document.getElementById('productGrid'),
  catalogHeading: document.getElementById('catalogHeading'),
  productCountBadge: document.getElementById('productCountBadge'),
  sortSelect: document.getElementById('sortSelect'),
  activeFilterBar: document.getElementById('activeFilterBar'),
  activeFilterText: document.getElementById('activeFilterText'),
  
  // Header Elements
  currentLocationText: document.getElementById('currentLocationText'),
  profileBtnLabel: document.getElementById('profileBtnLabel'),
  cartCountBadge: document.getElementById('cartCountBadge'),
  cartHeaderTotal: document.getElementById('cartHeaderTotal'),
  
  // Cart Drawer
  cartOverlay: document.getElementById('cartOverlay'),
  cartDrawer: document.getElementById('cartDrawer'),
  cartItemCountHeader: document.getElementById('cartItemCountHeader'),
  cartItemsContainer: document.getElementById('cartItemsContainer'),
  freeDeliveryMessage: document.getElementById('freeDeliveryMessage'),
  freeDeliveryStatus: document.getElementById('freeDeliveryStatus'),
  freeDeliveryProgress: document.getElementById('freeDeliveryProgress'),
  couponInput: document.getElementById('couponInput'),
  couponStatusMessage: document.getElementById('couponStatusMessage'),
  billSubtotal: document.getElementById('billSubtotal'),
  billDiscountRow: document.getElementById('billDiscountRow'),
  billDiscount: document.getElementById('billDiscount'),
  billDeliveryFee: document.getElementById('billDeliveryFee'),
  billTax: document.getElementById('billTax'),
  billGrandTotal: document.getElementById('billGrandTotal'),
  checkoutBtnPrice: document.getElementById('checkoutBtnPrice'),
  
  // Modals
  locationModalOverlay: document.getElementById('locationModalOverlay'),
  profileModalOverlay: document.getElementById('profileModalOverlay'),
  loginSection: document.getElementById('loginSection'),
  loggedInSection: document.getElementById('loggedInSection'),
  displayUserName: document.getElementById('displayUserName'),
  displayUserPhone: document.getElementById('displayUserPhone'),
  checkoutOverlay: document.getElementById('checkoutOverlay'),
  modalPayableTotal: document.getElementById('modalPayableTotal'),
  orderSuccessOverlay: document.getElementById('orderSuccessOverlay'),
  successOrderId: document.getElementById('successOrderId'),
  receiptItemsList: document.getElementById('receiptItemsList'),
  receiptTotalsList: document.getElementById('receiptTotalsList'),
  ordersHistoryOverlay: document.getElementById('ordersHistoryOverlay'),
  ordersHistoryList: document.getElementById('ordersHistoryList'),
  toastContainer: document.getElementById('toastContainer'),
};

// ==========================================
// Initialization & Bootstrap
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  initUserSession();
  initLocation();
  startCarouselAutoPlay();
  await loadCategories();
  await loadCart();
  await fetchProducts();
});

function initUserSession() {
  if (state.user && state.user.name) {
    if (DOM.profileBtnLabel) DOM.profileBtnLabel.textContent = state.user.name.split(' ')[0];
    if (DOM.displayUserName) DOM.displayUserName.textContent = state.user.name;
    if (DOM.displayUserPhone) DOM.displayUserPhone.textContent = `+91 ${state.user.phone}`;
    if (DOM.loginSection) DOM.loginSection.style.display = 'none';
    if (DOM.loggedInSection) DOM.loggedInSection.style.display = 'block';
  }
}

function initLocation() {
  if (DOM.currentLocationText) {
    DOM.currentLocationText.textContent = state.currentLocation;
  }
}

// ==========================================
// 4. Hero Carousel Logic
// ==========================================
function startCarouselAutoPlay() {
  if (state.carouselTimer) clearInterval(state.carouselTimer);
  state.carouselTimer = setInterval(() => {
    nextCarouselSlide();
  }, 5000);
}

function nextCarouselSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  goToCarouselSlide((state.carouselIndex + 1) % slides.length);
}

function prevCarouselSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  goToCarouselSlide((state.carouselIndex - 1 + slides.length) % slides.length);
}

function goToCarouselSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');
  if (!slides.length) return;
  
  slides.forEach(s => s.classList.remove('active'));
  indicators.forEach(ind => ind.classList.remove('active'));
  
  state.carouselIndex = index;
  slides[index].classList.add('active');
  if (indicators[index]) indicators[index].classList.add('active');
  
  startCarouselAutoPlay(); // reset timer
}

// ==========================================
// Event Listeners Setup
// ==========================================
function setupEventListeners() {
  // Search
  let searchDebounce;
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => fetchProducts(), 250);
    });
  }

  if (DOM.clearSearchBtn) {
    DOM.clearSearchBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      state.searchQuery = '';
      DOM.clearSearchBtn.style.display = 'none';
      fetchProducts();
    });
  }

  // Cart Drawer Trigger
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', () => toggleCartDrawer(true));
  if (DOM.cartOverlay) DOM.cartOverlay.addEventListener('click', () => toggleCartDrawer(false));

  // Payment Options radio clicks
  document.querySelectorAll('.payment-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
}

// ==========================================
// 3 & 5. Category & Subcategory Rendering
// ==========================================
async function loadCategories() {
  try {
    const data = await api.getCategories();
    if (data.success) {
      state.categories = data.categories;
      renderCategoriesNav();
      renderHomepageCategoryGrid();
    }
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

// Horizontal scroll category chips
function renderCategoriesNav() {
  if (!DOM.categoriesContainer) return;
  DOM.categoriesContainer.innerHTML = state.categories
    .map((cat) => {
      const icon = categoryIcons[cat] || '🛒';
      const isActive = state.activeCategory === cat ? 'active' : '';
      return `
        <button class="category-pill-btn ${isActive}" onclick="setCategoryFilter('${cat}')">
          <span class="category-icon">${icon}</span>
          <span>${cat}</span>
        </button>
      `;
    })
    .join('');
}

// 5. Homepage Category Grid (4 cols mobile, 7 cols desktop)
function renderHomepageCategoryGrid() {
  if (!DOM.homepageCategoryGrid) return;
  const popularCats = state.categories.filter(c => c !== 'All');
  DOM.homepageCategoryGrid.innerHTML = popularCats
    .map(cat => {
      const icon = categoryIcons[cat] || '🛒';
      const isActive = state.activeCategory === cat ? 'active' : '';
      return `
        <div class="category-card-item ${isActive}" onclick="setCategoryFilter('${cat}')">
          <span class="cat-card-icon">${icon}</span>
          <span class="cat-card-title">${cat}</span>
          <span class="cat-card-badge">⚡ 10 Mins</span>
        </div>
      `;
    })
    .join('');
}

function setCategoryFilter(category) {
  state.activeCategory = category;
  state.activeSubCategory = 'All';
  if (DOM.catalogHeading) DOM.catalogHeading.textContent = category === 'All' ? 'All Fresh Products' : category;
  renderCategoriesNav();
  renderHomepageCategoryGrid();
  updateActiveFilterBar();
  fetchProducts();
  scrollToSection('productsSection');
}

function setSubCategoryFilter(subCat) {
  state.activeSubCategory = subCat;
  updateSubcategoriesBar();
  renderProducts();
}

function renderSubcategoriesBar() {
  if (!DOM.subcategoriesBar || !DOM.subcategoriesList) return;
  
  if (state.activeCategory === 'All') {
    DOM.subcategoriesBar.style.display = 'none';
    return;
  }
  
  const subCats = ['All', ...new Set(state.products.map(p => p.subCategory).filter(Boolean))];
  if (subCats.length <= 2) {
    DOM.subcategoriesBar.style.display = 'none';
    return;
  }
  
  DOM.subcategoriesBar.style.display = 'flex';
  DOM.subcategoriesList.innerHTML = subCats.map(sc => {
    const isActive = state.activeSubCategory === sc ? 'active' : '';
    return `<button class="subcat-chip ${isActive}" onclick="setSubCategoryFilter('${sc}')">${sc}</button>`;
  }).join('');
}

function updateSubcategoriesBar() {
  document.querySelectorAll('.subcat-chip').forEach(chip => {
    chip.classList.toggle('active', chip.textContent.trim() === state.activeSubCategory);
  });
}

function updateActiveFilterBar() {
  if (!DOM.activeFilterBar) return;
  if (state.activeCategory !== 'All' || state.searchQuery) {
    DOM.activeFilterBar.style.display = 'flex';
    DOM.activeFilterText.textContent = state.searchQuery ? `Search: "${state.searchQuery}"` : state.activeCategory;
  } else {
    DOM.activeFilterBar.style.display = 'none';
  }
}

function scrollCategories(direction) {
  if (DOM.categoriesContainer) {
    DOM.categoriesContainer.scrollBy({ left: direction * 240, behavior: 'smooth' });
  }
}

function resetFilters() {
  state.activeCategory = 'All';
  state.activeSubCategory = 'All';
  state.searchQuery = '';
  if (DOM.searchInput) DOM.searchInput.value = '';
  if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = 'none';
  if (DOM.sortSelect) DOM.sortSelect.value = 'featured';
  state.sortBy = 'featured';
  if (DOM.catalogHeading) DOM.catalogHeading.textContent = 'All Fresh Products';
  renderCategoriesNav();
  renderHomepageCategoryGrid();
  updateActiveFilterBar();
  fetchProducts();
}

function handleSortChange(value) {
  state.sortBy = value;
  fetchProducts();
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// 6. Product Fetch & Grid Rendering (with Stepper)
// ==========================================
async function fetchProducts() {
  try {
    const params = {};
    if (state.activeCategory !== 'All') params.category = state.activeCategory;
    if (state.searchQuery) params.search = state.searchQuery;
    if (state.sortBy !== 'featured') params.sort = state.sortBy;

    const data = await api.getProducts(params);
    if (data.success) {
      state.products = data.data;
      if (DOM.productCountBadge) DOM.productCountBadge.textContent = `Showing ${data.count} items`;
      renderSubcategoriesBar();
      renderProducts();
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    showToast('Could not load products. Please check connection.');
  }
}

function renderProducts() {
  if (!DOM.productGrid) return;
  
  let list = state.products;
  if (state.activeSubCategory !== 'All') {
    list = list.filter(p => p.subCategory === state.activeSubCategory);
  }

  if (list.length === 0) {
    DOM.productGrid.innerHTML = `
      <div class="empty-products-view" style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <span style="font-size: 3rem;">🔍</span>
        <h4>No products found</h4>
        <p style="color: var(--text-muted);">Try a different search term or category filter.</p>
        <button class="btn btn-primary" onclick="resetFilters()" style="margin-top: 12px;">Browse All Products</button>
      </div>
    `;
    return;
  }

  DOM.productGrid.innerHTML = list.map(p => {
    const discountPercent = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    
    // Check if item is already in cart to display Quantity Stepper
    const cartItem = state.cart.items.find(item => item.id === p.id);
    const inCartQuantity = cartItem ? cartItem.quantity : 0;

    return `
      <div class="product-card" id="card-${p.id}">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${discountPercent > 0 ? `<span class="discount-badge">${discountPercent}% OFF</span>` : ''}
          ${p.badge ? `<span class="tag-badge">${p.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <span class="product-delivery-time">⚡ 10-15 MINS</span>
          <h4 class="product-title" title="${p.name}">${p.name}</h4>
          <span class="product-unit">${p.unit}</span>
          <div class="product-rating">
            <span class="star-icon">⭐</span>
            <span class="rating-val">${p.rating}</span>
            <span class="reviews-count">(${p.reviewsCount})</span>
          </div>
          <div class="product-price-row">
            <div class="price-wrap">
              <span class="current-price">₹${p.price}</span>
              ${p.originalPrice ? `<span class="original-price">₹${p.originalPrice}</span>` : ''}
            </div>
            <div class="product-actions-wrap" id="action-wrap-${p.id}">
              ${inCartQuantity > 0 ? `
                <div class="card-quantity-stepper">
                  <button class="stepper-btn" onclick="updateItemQuantity('${p.id}', ${inCartQuantity - 1})">-</button>
                  <span class="stepper-count">${inCartQuantity}</span>
                  <button class="stepper-btn" onclick="updateItemQuantity('${p.id}', ${inCartQuantity + 1})">+</button>
                </div>
              ` : `
                <button class="btn-add-product" onclick="addToCart('${p.id}')">
                  <span>ADD</span>
                  <span>+</span>
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Synchronize card buttons when cart updates
function syncProductCardSteppers() {
  state.products.forEach(p => {
    const wrap = document.getElementById(`action-wrap-${p.id}`);
    if (!wrap) return;
    const cartItem = state.cart.items.find(item => item.id === p.id);
    const inCartQuantity = cartItem ? cartItem.quantity : 0;
    if (inCartQuantity > 0) {
      wrap.innerHTML = `
        <div class="card-quantity-stepper">
          <button class="stepper-btn" onclick="updateItemQuantity('${p.id}', ${inCartQuantity - 1})">-</button>
          <span class="stepper-count">${inCartQuantity}</span>
          <button class="stepper-btn" onclick="updateItemQuantity('${p.id}', ${inCartQuantity + 1})">+</button>
        </div>
      `;
    } else {
      wrap.innerHTML = `
        <button class="btn-add-product" onclick="addToCart('${p.id}')">
          <span>ADD</span>
          <span>+</span>
        </button>
      `;
    }
  });
}

// ==========================================
// 7. Cart Drawer Logic & Operations
// ==========================================
function toggleCartDrawer(show) {
  if (DOM.cartDrawer && DOM.cartOverlay) {
    if (show) {
      DOM.cartDrawer.classList.add('open');
      DOM.cartOverlay.classList.add('open');
    } else {
      DOM.cartDrawer.classList.remove('open');
      DOM.cartOverlay.classList.remove('open');
    }
  }
}

async function loadCart() {
  try {
    const data = await api.getCart();
    if (data.success) {
      state.cart = data.cart;
      renderCartUI();
      syncProductCardSteppers();
    }
  } catch (error) {
    console.error('Failed to load cart:', error);
  }
}

async function addToCart(productId) {
  try {
    const data = await api.addToCart(productId, 1);
    if (data.success) {
      state.cart = data.cart;
      renderCartUI();
      syncProductCardSteppers();
      showToast('Item added to cart! 🛒');
    }
  } catch (error) {
    console.error('Add to cart failed:', error);
    showToast('Failed to add item. Please try again.');
  }
}

async function updateItemQuantity(productId, newQty) {
  try {
    let data;
    if (newQty <= 0) {
      data = await api.removeFromCart(productId);
    } else {
      data = await api.updateCartItem(productId, newQty);
    }
    if (data && data.success) {
      state.cart = data.cart;
      renderCartUI();
      syncProductCardSteppers();
    }
  } catch (error) {
    console.error('Update quantity failed:', error);
    showToast('Could not update quantity.');
  }
}

function renderCartUI() {
  const { items, subtotal, totalItems, deliveryFee, tax, discount, total } = state.cart;
  
  // Header badges
  if (DOM.cartCountBadge) DOM.cartCountBadge.textContent = totalItems;
  if (DOM.cartHeaderTotal) DOM.cartHeaderTotal.textContent = `₹${total}`;
  if (DOM.cartItemCountHeader) DOM.cartItemCountHeader.textContent = `${totalItems} items`;
  
  // Free delivery progress bar (threshold ₹299)
  const freeThreshold = 299;
  if (DOM.freeDeliveryProgress && DOM.freeDeliveryMessage && DOM.freeDeliveryStatus) {
    if (subtotal >= freeThreshold) {
      DOM.freeDeliveryProgress.style.width = '100%';
      DOM.freeDeliveryMessage.textContent = '🎉 You unlocked FREE Delivery!';
      DOM.freeDeliveryStatus.textContent = `₹${subtotal} / ₹${freeThreshold}`;
    } else {
      const needed = freeThreshold - subtotal;
      const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
      DOM.freeDeliveryProgress.style.width = `${progressPercent}%`;
      DOM.freeDeliveryMessage.textContent = `⚡ Add ₹${needed} more for FREE Delivery`;
      DOM.freeDeliveryStatus.textContent = `₹${subtotal} / ₹${freeThreshold}`;
    }
  }

  // Cart items list
  if (DOM.cartItemsContainer) {
    if (items.length === 0) {
      DOM.cartItemsContainer.innerHTML = `
        <div class="empty-cart-state" style="text-align: center; padding: 40px 20px;">
          <span style="font-size: 3.5rem;">🛒</span>
          <h4>Your cart is empty</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin: 8px 0 20px;">Your favorite items are just 10-15 mins away!</p>
          <button class="btn btn-primary" onclick="toggleCartDrawer(false); scrollToSection('productsSection');">Start Shopping</button>
        </div>
      `;
    } else {
      DOM.cartItemsContainer.innerHTML = items.map(item => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h5 class="cart-item-name">${item.name}</h5>
            <span class="cart-item-unit">${item.unit}</span>
            <div class="cart-item-pricing">
              <span class="cart-item-price">₹${item.price}</span>
              ${item.originalPrice ? `<span class="cart-item-mrp">₹${item.originalPrice}</span>` : ''}
            </div>
          </div>
          <div class="cart-quantity-stepper">
            <button class="stepper-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <span class="stepper-count">${item.quantity}</span>
            <button class="stepper-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
      `).join('');
    }
  }

  // Bill breakdown
  if (DOM.billSubtotal) DOM.billSubtotal.textContent = `₹${subtotal}`;
  if (DOM.billDiscountRow) {
    DOM.billDiscountRow.style.display = discount > 0 ? 'flex' : 'none';
    if (DOM.billDiscount) DOM.billDiscount.textContent = `-₹${discount}`;
  }
  if (DOM.billDeliveryFee) DOM.billDeliveryFee.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
  if (DOM.billTax) DOM.billTax.textContent = `₹${tax}`;
  if (DOM.billGrandTotal) DOM.billGrandTotal.textContent = `₹${total}`;
  if (DOM.checkoutBtnPrice) DOM.checkoutBtnPrice.textContent = `₹${total} →`;
}

// Coupons
async function applyCoupon() {
  const code = DOM.couponInput ? DOM.couponInput.value.trim() : '';
  if (!code) {
    showToast('Please enter a coupon code.');
    return;
  }
  try {
    const data = await api.applyCoupon(code);
    if (data.success) {
      state.cart = data.cart;
      renderCartUI();
      if (DOM.couponStatusMessage) {
        DOM.couponStatusMessage.innerHTML = `<span style="color: var(--primary-dark); font-weight: 700;">✓ Coupon ${code.toUpperCase()} applied successfully!</span>`;
      }
      showToast(`Coupon ${code.toUpperCase()} applied! 🎉`);
    } else {
      if (DOM.couponStatusMessage) {
        DOM.couponStatusMessage.innerHTML = `<span style="color: var(--danger); font-weight: 600;">✕ ${data.error}</span>`;
      }
    }
  } catch (error) {
    showToast('Invalid promo code.');
  }
}

function quickApplyCoupon(code) {
  if (DOM.couponInput) DOM.couponInput.value = code;
  applyCoupon();
}

// ==========================================
// Location Picker Modal Handlers
// ==========================================
function openLocationModal() {
  if (DOM.locationModalOverlay) DOM.locationModalOverlay.classList.add('open');
}

function closeLocationModal() {
  if (DOM.locationModalOverlay) DOM.locationModalOverlay.classList.remove('open');
}

function selectLocation(locName) {
  state.currentLocation = locName;
  localStorage.setItem('freshmart_location', locName);
  if (DOM.currentLocationText) DOM.currentLocationText.textContent = locName;
  closeLocationModal();
  showToast(`Delivering to ${locName} 📍`);
}

function detectGPSLocation() {
  if ("geolocation" in navigator) {
    showToast('Detecting location via GPS...');
    navigator.geolocation.getCurrentPosition(
      () => {
        selectLocation('Koramangala 4th Block, Bengaluru (560034)');
      },
      () => {
        selectLocation('Indiranagar 100ft Rd, Bengaluru (560038)');
      }
    );
  } else {
    selectLocation('Koramangala, Bengaluru (560034)');
  }
}

// ==========================================
// Profile & Login Modal Handlers
// ==========================================
function openProfileModal() {
  if (DOM.profileModalOverlay) DOM.profileModalOverlay.classList.add('open');
}

function closeProfileModal() {
  if (DOM.profileModalOverlay) DOM.profileModalOverlay.classList.remove('open');
}

function handleQuickLogin(e) {
  e.preventDefault();
  const phone = document.getElementById('loginPhone').value.trim();
  const name = document.getElementById('loginName').value.trim();
  
  if (phone.length !== 10 || !name) {
    showToast('Please enter valid name and 10-digit number.');
    return;
  }

  state.user = { name, phone };
  localStorage.setItem('freshmart_user', JSON.stringify(state.user));
  initUserSession();
  closeProfileModal();
  showToast(`Welcome to FreshMart, ${name}! 🎉`);
}

function handleLogout() {
  state.user = null;
  localStorage.removeItem('freshmart_user');
  if (DOM.profileBtnLabel) DOM.profileBtnLabel.textContent = 'Login';
  if (DOM.loginSection) DOM.loginSection.style.display = 'block';
  if (DOM.loggedInSection) DOM.loggedInSection.style.display = 'none';
  closeProfileModal();
  showToast('Logged out successfully.');
}

// ==========================================
// Checkout & Orders Handlers
// ==========================================
function openCheckoutModal() {
  if (state.cart.items.length === 0) {
    showToast('Your cart is empty! Add items first.');
    return;
  }
  if (DOM.modalPayableTotal) DOM.modalPayableTotal.textContent = `₹${state.cart.total}`;
  
  // Pre-fill user data if logged in
  if (state.user) {
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    if (nameInput) nameInput.value = state.user.name;
    if (phoneInput) phoneInput.value = state.user.phone;
  }
  
  if (DOM.checkoutOverlay) DOM.checkoutOverlay.classList.add('open');
}

function closeCheckoutModal() {
  if (DOM.checkoutOverlay) DOM.checkoutOverlay.classList.remove('open');
}

async function handlePlaceOrder(e) {
  e.preventDefault();
  
  const customerName = document.getElementById('customerName').value.trim();
  const customerPhone = document.getElementById('customerPhone').value.trim();
  const customerEmail = document.getElementById('customerEmail').value.trim();
  const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
  const deliveryArea = document.getElementById('deliveryArea').value.trim();
  const deliveryPincode = document.getElementById('deliveryPincode').value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

  const orderPayload = {
    customer: {
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      address: `${deliveryAddress}, ${deliveryArea}, Pincode: ${deliveryPincode}`,
    },
    paymentMethod,
    deliverySlot: 'Express 10-15 Mins'
  };

  try {
    const res = await api.createOrder(orderPayload);
    if (res.success) {
      closeCheckoutModal();
      toggleCartDrawer(false);
      
      // Update state cart
      state.cart = { items: [], subtotal: 0, totalItems: 0, deliveryFee: 0, tax: 0, discount: 0, total: 0 };
      renderCartUI();
      syncProductCardSteppers();

      // Show success modal
      if (DOM.successOrderId) DOM.successOrderId.textContent = `Order ID: ${res.order.id}`;
      if (DOM.receiptItemsList) {
        DOM.receiptItemsList.innerHTML = res.order.items.map(item => `
          <div class="receipt-item-line">
            <span>${item.quantity}x ${item.name} (${item.unit})</span>
            <strong>₹${item.price * item.quantity}</strong>
          </div>
        `).join('');
      }
      if (DOM.receiptTotalsList) {
        DOM.receiptTotalsList.innerHTML = `
          <div class="receipt-item-line"><span>Payment:</span><strong>${res.order.paymentMethod}</strong></div>
          <div class="receipt-item-line"><span>Total Paid:</span><strong style="color: var(--primary-dark);">₹${res.order.total}</strong></div>
        `;
      }
      if (DOM.orderSuccessOverlay) DOM.orderSuccessOverlay.classList.add('open');
      showToast('Order confirmed! Arriving in 10-15 mins 🛵');
    }
  } catch (error) {
    showToast('Failed to place order. Please try again.');
  }
}

function closeSuccessModal() {
  if (DOM.orderSuccessOverlay) DOM.orderSuccessOverlay.classList.remove('open');
}

// Past orders
async function openOrdersHistoryModal() {
  try {
    const res = await api.getOrders();
    if (res.success && DOM.ordersHistoryList) {
      if (res.orders.length === 0) {
        DOM.ordersHistoryList.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <span style="font-size: 3rem;">📦</span>
            <h4>No past orders yet</h4>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Place your first order to track it here in real time!</p>
          </div>
        `;
      } else {
        DOM.ordersHistoryList.innerHTML = res.orders.map(ord => `
          <div class="order-history-card">
            <div class="order-card-top">
              <div>
                <strong>${ord.id}</strong>
                <small style="display: block; color: var(--text-muted);">${new Date(ord.createdAt).toLocaleString()}</small>
              </div>
              <span class="badge-status-placed">⚡ ${ord.status.toUpperCase()}</span>
            </div>
            <div class="order-items-snippet">
              ${ord.items.map(i => `<span>${i.quantity}x ${i.name}</span>`).join(', ')}
            </div>
            <div class="order-card-bottom">
              <span>Total Paid: <strong>₹${ord.total}</strong></span>
              <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" onclick="reorderItems('${ord.id}')">Reorder 🔁</button>
            </div>
          </div>
        `).join('');
      }
      if (DOM.ordersHistoryOverlay) DOM.ordersHistoryOverlay.classList.add('open');
    }
  } catch (error) {
    showToast('Could not fetch past orders.');
  }
}

function closeOrdersHistoryModal() {
  if (DOM.ordersHistoryOverlay) DOM.ordersHistoryOverlay.classList.remove('open');
}

async function reorderItems(orderId) {
  showToast('Reordering items to cart...');
  closeOrdersHistoryModal();
  toggleCartDrawer(true);
}

// Toast helper
function showToast(message) {
  if (!DOM.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast-bubble';
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
