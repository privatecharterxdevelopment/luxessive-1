/* ===================================================
   ÈSSENCE — Full E-Commerce SPA
   Router · Cart · Product Detail · Checkout · Success
   =================================================== */

(() => {
  'use strict';

  /* -----------------------------------------------
     PRODUCT DATA
     ----------------------------------------------- */
  const PRODUCTS = [
    {
      id: 1, slug: 'oversized-cotton-tee',
      name: 'Oversized Cotton Tee', price: 85,
      category: 'Clothing',
      colors: [
        { name: 'White', hex: '#ffffff' },
        { name: 'Grey',  hex: '#b0b0b0' },
        { name: 'Black', hex: '#111111' }
      ],
      sizes: ['XS','S','M','L','XL'],
      disabledSizes: [],
      description: 'A relaxed-fit tee crafted from heavyweight organic cotton. Dropped shoulders and a boxy silhouette create an effortlessly modern look.',
      details: ['100% organic cotton, 240gsm', 'Relaxed oversized fit', 'Ribbed crew neck', 'Made in Portugal'],
      care: ['Machine wash cold', 'Do not bleach', 'Tumble dry low', 'Iron on low heat']
    },
    {
      id: 2, slug: 'wide-leg-trousers',
      name: 'Wide Leg Trousers', price: 145,
      category: 'Clothing',
      colors: [
        { name: 'Black',    hex: '#111111' },
        { name: 'Charcoal', hex: '#555555' }
      ],
      sizes: ['XS','S','M','L','XL'],
      disabledSizes: ['XS'],
      description: 'Clean-lined wide leg trousers with a high waist and pressed crease. Cut from a fluid wool-blend for movement and structure.',
      details: ['70% wool, 30% polyester', 'High waist, wide leg', 'Side pockets, one back pocket', 'Made in Italy'],
      care: ['Dry clean only', 'Iron on medium heat', 'Do not tumble dry']
    },
    {
      id: 3, slug: 'minimal-leather-sneaker',
      name: 'Minimal Leather Sneaker', price: 220,
      category: 'Shoes',
      colors: [
        { name: 'White', hex: '#ffffff' },
        { name: 'Black', hex: '#111111' }
      ],
      sizes: ['38','39','40','41','42','43','44','45'],
      disabledSizes: ['45'],
      description: 'A pared-back sneaker in full-grain Italian leather. Margom rubber sole, minimal branding, and a clean cupsole construction.',
      details: ['Full-grain Italian leather upper', 'Leather lining', 'Margom rubber outsole', 'Made in Italy'],
      care: ['Wipe with damp cloth', 'Use leather conditioner', 'Store with shoe trees']
    },
    {
      id: 4, slug: 'structured-tote-bag',
      name: 'Structured Tote Bag', price: 310,
      category: 'Bags',
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Stone', hex: '#c8bfa9' }
      ],
      sizes: ['One Size'],
      disabledSizes: [],
      description: 'An architectural tote in vegetable-tanned leather. Structured base, unlined interior, and reinforced handles for daily carry.',
      details: ['Vegetable-tanned leather', '38 × 32 × 14 cm', 'Interior zip pocket', 'Reinforced handles, 22cm drop', 'Made in Spain'],
      care: ['Avoid prolonged sun exposure', 'Wipe with dry cloth', 'Use leather balm quarterly']
    },
    {
      id: 5, slug: 'deconstructed-blazer',
      name: 'Deconstructed Blazer', price: 395,
      category: 'Clothing',
      colors: [
        { name: 'Black', hex: '#111111' }
      ],
      sizes: ['XS','S','M','L','XL'],
      disabledSizes: ['XS','XL'],
      description: 'An unstructured blazer with soft shoulders and a relaxed silhouette. No lining, no padding — just fabric and form.',
      details: ['100% wool crepe', 'Unstructured, no padding', 'Single button closure', 'Patch pockets', 'Made in Italy'],
      care: ['Dry clean recommended', 'Steam to refresh', 'Hang on wide hanger']
    },
    {
      id: 6, slug: 'suede-chelsea-boot',
      name: 'Suede Chelsea Boot', price: 275,
      category: 'Shoes',
      colors: [
        { name: 'Sand',  hex: '#c8b89a' },
        { name: 'Black', hex: '#111111' }
      ],
      sizes: ['39','40','41','42','43','44','45'],
      disabledSizes: [],
      description: 'A clean Chelsea boot in brushed suede with elastic side panels and a stacked leather heel. Blake-stitched for a sleek profile.',
      details: ['Premium suede upper', 'Leather sole, stacked heel', 'Blake stitch construction', 'Elastic side panels', 'Made in Italy'],
      care: ['Use suede brush regularly', 'Apply waterproof spray', 'Store with boot trees']
    }
  ];

  const SHIPPING_COST = 12;
  const FREE_SHIPPING_THRESHOLD = 250;

  /* -----------------------------------------------
     CART STATE (localStorage)
     ----------------------------------------------- */
  let cart = JSON.parse(localStorage.getItem('essence_cart') || '[]');

  function saveCart() {
    localStorage.setItem('essence_cart', JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(productId, color, size, qty = 1) {
    const existing = cart.find(i => i.productId === productId && i.color === color && i.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId, color, size, qty });
    }
    saveCart();
  }

  function updateCartQty(index, qty) {
    if (qty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = qty;
    }
    saveCart();
  }

  function removeCartItem(index) {
    cart.splice(index, 1);
    saveCart();
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => {
      const p = PRODUCTS.find(pr => pr.id === item.productId);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  /* -----------------------------------------------
     DOM REFERENCES
     ----------------------------------------------- */
  const app          = document.getElementById('app');
  const menuToggle   = document.getElementById('menuToggle');
  const sideMenu     = document.getElementById('sideMenu');
  const menuOverlay  = document.getElementById('menuOverlay');
  const cartBtn      = document.getElementById('cartBtn');
  const cartDrawer   = document.getElementById('cartDrawer');
  const cartOverlay  = document.getElementById('cartOverlay');
  const cartClose    = document.getElementById('cartClose');
  const cartBody     = document.getElementById('cartBody');
  const cartFooter   = document.getElementById('cartFooter');
  const cartCountEl  = document.getElementById('cartCount');

  /* -----------------------------------------------
     SIDE MENU
     ----------------------------------------------- */
  function openMenu() {
    sideMenu.classList.add('is-open');
    menuOverlay.classList.add('is-visible');
    menuToggle.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    sideMenu.classList.remove('is-open');
    menuOverlay.classList.remove('is-visible');
    menuToggle.classList.remove('is-active');
    document.body.style.overflow = '';
  }
  menuToggle.addEventListener('click', () => {
    sideMenu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  menuOverlay.addEventListener('click', closeMenu);
  sideMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Menu group fold/unfold
  document.querySelectorAll('.menu-group__toggle').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.menu-group').classList.toggle('is-expanded'));
  });

  /* -----------------------------------------------
     CART DRAWER
     ----------------------------------------------- */
  function openCart() {
    closeMenu();
    renderCartDrawer();
    cartDrawer.classList.add('is-open');
    cartOverlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartDrawer.classList.remove('is-open');
    cartOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }
  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function updateCartCount() {
    const count = getCartItemCount();
    cartCountEl.textContent = count;
  }

  function renderCartDrawer() {
    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-drawer__empty">
          <div class="cart-drawer__empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="10" y="18" width="28" height="22" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M18 18V14a6 6 0 0 1 12 0v4" stroke="currentColor" stroke-width="1.5"/></svg>
          </div>
          <p>Your cart is empty</p>
          <a href="#/" class="btn btn--secondary" onclick="document.getElementById('cartDrawer').classList.remove('is-open');document.getElementById('cartOverlay').classList.remove('is-visible');document.body.style.overflow=''">Continue Shopping</a>
        </div>`;
      cartFooter.classList.add('is-hidden');
      return;
    }

    cartFooter.classList.remove('is-hidden');

    cartBody.innerHTML = cart.map((item, i) => {
      const p = PRODUCTS.find(pr => pr.id === item.productId);
      if (!p) return '';
      const num = String(p.id).padStart(2, '0');
      return `
        <div class="cart-item">
          <div class="cart-item__image">${num}</div>
          <div class="cart-item__details">
            <div>
              <div class="cart-item__name">${p.name}</div>
              <div class="cart-item__variant">${item.color} / ${item.size}</div>
            </div>
            <div class="cart-item__bottom">
              <div class="qty-control">
                <button data-cart-qty="${i}" data-delta="-1">−</button>
                <span class="qty-control__value">${item.qty}</span>
                <button data-cart-qty="${i}" data-delta="1">+</button>
              </div>
              <span class="cart-item__price">€${p.price * item.qty}</span>
            </div>
            <button class="cart-item__remove" data-cart-remove="${i}">Remove</button>
          </div>
        </div>`;
    }).join('');

    const subtotal = getCartTotal();
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    cartFooter.innerHTML = `
      <div class="cart-summary-row">
        <span>Subtotal</span><span>€${subtotal}</span>
      </div>
      <div class="cart-summary-row">
        <span>Shipping</span><span>${shipping === 0 ? 'Free' : '€' + shipping}</span>
      </div>
      <div class="cart-summary-row cart-summary-row--total">
        <span>Total</span><span>€${total}</span>
      </div>
      <a href="#/checkout" class="btn btn--primary btn--full" id="drawerCheckoutBtn">Checkout</a>`;

    // Qty buttons
    cartBody.querySelectorAll('[data-cart-qty]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.cartQty);
        const delta = parseInt(btn.dataset.delta);
        updateCartQty(idx, cart[idx].qty + delta);
        renderCartDrawer();
      });
    });

    // Remove buttons
    cartBody.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        removeCartItem(parseInt(btn.dataset.cartRemove));
        renderCartDrawer();
      });
    });

    // Checkout button closes drawer
    const checkoutBtn = document.getElementById('drawerCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', closeCart);
    }
  }

  /* -----------------------------------------------
     KEYBOARD
     ----------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeCart();
    }
  });

  /* -----------------------------------------------
     ROUTER
     ----------------------------------------------- */
  function getRoute() {
    return location.hash || '#/';
  }

  function navigate() {
    const hash = getRoute();
    window.scrollTo(0, 0);

    if (hash.startsWith('#/product/')) {
      const id = parseInt(hash.split('/')[2]);
      renderProductPage(id);
    } else if (hash === '#/checkout') {
      renderCheckoutPage();
    } else if (hash === '#/success') {
      renderSuccessPage();
    } else {
      renderHomePage();
    }

    initRevealAnimations();
  }

  window.addEventListener('hashchange', navigate);

  /* -----------------------------------------------
     HOME PAGE
     ----------------------------------------------- */
  function renderHomePage() {
    const categoryIcons = {
      Clothing: '<svg viewBox="0 0 100 100" fill="none"><path d="M30 25L50 15L70 25V40L60 35V75H40V35L30 40V25Z" stroke="currentColor" stroke-width="1.5"/></svg>',
      Shoes: '<svg viewBox="0 0 100 100" fill="none"><path d="M20 60C20 60 25 45 40 45C55 45 55 55 70 55C78 55 80 60 80 60V68H20V60Z" stroke="currentColor" stroke-width="1.5"/><line x1="20" y1="68" x2="80" y2="68" stroke="currentColor" stroke-width="1.5"/></svg>',
      Bags: '<svg viewBox="0 0 100 100" fill="none"><rect x="25" y="40" width="50" height="40" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M38 40V30C38 23.4 43.4 18 50 18C56.6 18 62 23.4 62 30V40" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
      Accessories: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="28" stroke="currentColor" stroke-width="1.5"/><circle cx="50" cy="50" r="10" stroke="currentColor" stroke-width="1.5"/><line x1="50" y1="22" x2="50" y2="40" stroke="currentColor" stroke-width="1.5"/></svg>'
    };

    const categories = ['Clothing', 'Shoes', 'Bags', 'Accessories'];
    const categoryCounts = {};
    categories.forEach(c => { categoryCounts[c] = PRODUCTS.filter(p => p.category === c).length; });

    app.innerHTML = `
      <!-- Hero -->
      <section class="hero">
        <div class="hero__content">
          <p class="hero__eyebrow">SS26 Collection</p>
          <h1 class="hero__title">Refined<br>Essentials<br>for Modern<br>Living</h1>
          <a href="#/" class="btn btn--primary">Explore Collection</a>
        </div>
        <div class="hero__visual">
          <div class="hero__image-block">
            <div class="hero__placeholder"><span>ÈSSENCE</span></div>
          </div>
        </div>
      </section>

      <!-- Marquee -->
      <div class="marquee">
        <div class="marquee__track">
          <span>Contemporary Essentials</span><span class="marquee__dot"></span>
          <span>Minimal Design</span><span class="marquee__dot"></span>
          <span>Thoughtful Details</span><span class="marquee__dot"></span>
          <span>Sustainable Materials</span><span class="marquee__dot"></span>
          <span>Contemporary Essentials</span><span class="marquee__dot"></span>
          <span>Minimal Design</span><span class="marquee__dot"></span>
          <span>Thoughtful Details</span><span class="marquee__dot"></span>
          <span>Sustainable Materials</span><span class="marquee__dot"></span>
        </div>
      </div>

      <!-- Categories -->
      <section class="categories">
        <div class="section-header">
          <h2 class="section-title">Shop by Category</h2>
          <a href="#/" class="section-link">View All</a>
        </div>
        <div class="categories__grid">
          ${categories.map(cat => `
            <div class="category-card">
              <div class="category-card__image">
                <div class="category-card__placeholder">${categoryIcons[cat]}</div>
              </div>
              <div class="category-card__info">
                <h3>${cat}</h3>
                <span class="category-card__count">${categoryCounts[cat]} pieces</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Products -->
      <section class="products">
        <div class="section-header">
          <h2 class="section-title">Featured</h2>
          <a href="#/" class="section-link">View All</a>
        </div>
        <div class="products__grid">
          ${PRODUCTS.map(p => {
            const num = String(p.id).padStart(2, '0');
            return `
              <article class="product-card" data-product-id="${p.id}">
                <div class="product-card__image">
                  <div class="product-card__placeholder">${num}</div>
                  <button class="product-card__quick" data-quick-add="${p.id}" aria-label="Quick add">+</button>
                </div>
                <div class="product-card__info">
                  <h3 class="product-card__name">${p.name}</h3>
                  <span class="product-card__price">€${p.price}</span>
                </div>
                <div class="product-card__colors">
                  ${p.colors.map(c => `<span class="swatch" style="background:${c.hex};${c.hex === '#ffffff' ? 'border:1px solid #e0e0e0' : 'border:1px solid ' + c.hex}" title="${c.name}"></span>`).join('')}
                </div>
              </article>`;
          }).join('')}
        </div>
      </section>

      <!-- Editorial -->
      <section class="editorial">
        <div class="editorial__left">
          <div class="editorial__placeholder"><span>Editorial</span></div>
        </div>
        <div class="editorial__right">
          <p class="editorial__eyebrow">Our Philosophy</p>
          <h2 class="editorial__title">Less, but<br>better.</h2>
          <p class="editorial__text">We believe in the power of restraint. Every piece in our collection is designed to transcend seasons — built with intention, crafted with precision, made to last.</p>
          <a href="#/" class="btn btn--secondary">Read More</a>
        </div>
      </section>

      <!-- Newsletter -->
      <section class="newsletter">
        <div class="newsletter__inner">
          <h2 class="newsletter__title">Stay in the Loop</h2>
          <p class="newsletter__text">First access to new drops, exclusive offers, and editorial content.</p>
          <form class="newsletter__form" onsubmit="event.preventDefault()">
            <input type="email" placeholder="your@email.com" class="newsletter__input" required>
            <button type="submit" class="btn btn--primary">Subscribe</button>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer__grid">
          <div class="footer__col">
            <a href="#/" class="logo logo--footer">ÈSSENCE</a>
            <p class="footer__tagline">Contemporary essentials<br>for modern living.</p>
          </div>
          <div class="footer__col">
            <h4 class="footer__heading">Shop</h4>
            <ul><li><a href="#/">Clothing</a></li><li><a href="#/">Shoes</a></li><li><a href="#/">Bags</a></li><li><a href="#/">Accessories</a></li></ul>
          </div>
          <div class="footer__col">
            <h4 class="footer__heading">Info</h4>
            <ul><li><a href="#">About</a></li><li><a href="#">Sustainability</a></li><li><a href="#">Shipping &amp; Returns</a></li><li><a href="#">FAQ</a></li></ul>
          </div>
          <div class="footer__col">
            <h4 class="footer__heading">Connect</h4>
            <ul><li><a href="#">Instagram</a></li><li><a href="#">Pinterest</a></li><li><a href="#">Contact</a></li></ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>&copy; 2026 ÈSSENCE. All rights reserved.</span>
          <div class="footer__bottom-links"><a href="#">Privacy</a><a href="#">Terms</a></div>
        </div>
      </footer>
    `;

    // Product card click → detail page
    app.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't navigate if quick-add button was clicked
        if (e.target.closest('.product-card__quick')) return;
        const id = card.dataset.productId;
        location.hash = `#/product/${id}`;
      });
    });

    // Quick-add buttons → add first color, first available size
    app.querySelectorAll('[data-quick-add]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = PRODUCTS.find(pr => pr.id === parseInt(btn.dataset.quickAdd));
        if (!p) return;
        const color = p.colors[0].name;
        const size = p.sizes.find(s => !p.disabledSizes.includes(s)) || p.sizes[0];
        addToCart(p.id, color, size, 1);

        // Visual feedback
        btn.textContent = '✓';
        btn.style.background = 'var(--black)';
        btn.style.color = 'var(--white)';
        btn.style.borderColor = 'var(--black)';
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
        setTimeout(() => {
          btn.textContent = '+';
          btn.style.background = '';
          btn.style.color = '';
          btn.style.borderColor = '';
          btn.style.opacity = '';
          btn.style.transform = '';
        }, 1200);
      });
    });
  }

  /* -----------------------------------------------
     PRODUCT DETAIL PAGE
     ----------------------------------------------- */
  function renderProductPage(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) { location.hash = '#/'; return; }

    let selectedColor = product.colors[0].name;
    let selectedSize  = '';
    let qty = 1;
    let sizeError = '';
    let addedMsg = '';

    function render() {
      const num = String(product.id).padStart(2, '0');

      app.innerHTML = `
        <div class="pdp">
          <a href="#/" class="pdp__back">← Back to Shop</a>
          <div class="pdp__grid">
            <!-- Gallery -->
            <div class="pdp__gallery">
              <div class="pdp__image-main" id="mainImage">${num}</div>
              <div class="pdp__thumbs">
                ${[1,2,3,4].map((n, i) => `
                  <div class="pdp__thumb ${i === 0 ? 'is-active' : ''}" data-thumb="${i}">
                    ${num}.${n}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Info -->
            <div class="pdp__info">
              <p class="pdp__category">${product.category}</p>
              <h1 class="pdp__name">${product.name}</h1>
              <p class="pdp__price">€${product.price}</p>

              <!-- Colors -->
              <p class="pdp__section-label">Color</p>
              <div class="pdp__colors">
                ${product.colors.map(c => `
                  <button class="pdp__color-swatch ${c.name === selectedColor ? 'is-active' : ''}"
                          data-color="${c.name}"
                          title="${c.name}">
                    <span style="display:none"></span>
                  </button>
                `).join('')}
              </div>
              <p class="pdp__color-name">${selectedColor}</p>

              <!-- Sizes -->
              <p class="pdp__section-label">Size</p>
              <div class="pdp__sizes">
                ${product.sizes.map(s => {
                  const disabled = product.disabledSizes.includes(s);
                  return `<button class="pdp__size ${s === selectedSize ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''}"
                                  data-size="${s}" ${disabled ? 'disabled' : ''}>${s}</button>`;
                }).join('')}
              </div>
              <p class="pdp__size-error">${sizeError}</p>

              <!-- Add to Cart -->
              <div class="pdp__add-row">
                <div class="qty-control">
                  <button id="pdpQtyMinus">−</button>
                  <span class="qty-control__value" id="pdpQtyVal">${qty}</span>
                  <button id="pdpQtyPlus">+</button>
                </div>
                <button class="btn btn--primary pdp__add-btn" id="pdpAddBtn">Add to Cart — €${product.price * qty}</button>
              </div>
              <p class="pdp__added-msg" id="pdpAddedMsg">${addedMsg}</p>

              <!-- Accordion -->
              <div class="pdp__accordion">
                <div class="pdp__accordion-item is-expanded">
                  <button class="pdp__accordion-toggle">
                    <span>Description</span>
                    <span class="menu-plus"></span>
                  </button>
                  <div class="pdp__accordion-body">
                    <div class="pdp__accordion-content">${product.description}</div>
                  </div>
                </div>
                <div class="pdp__accordion-item">
                  <button class="pdp__accordion-toggle">
                    <span>Details</span>
                    <span class="menu-plus"></span>
                  </button>
                  <div class="pdp__accordion-body">
                    <div class="pdp__accordion-content">
                      <ul>${product.details.map(d => `<li>${d}</li>`).join('')}</ul>
                    </div>
                  </div>
                </div>
                <div class="pdp__accordion-item">
                  <button class="pdp__accordion-toggle">
                    <span>Care</span>
                    <span class="menu-plus"></span>
                  </button>
                  <div class="pdp__accordion-body">
                    <div class="pdp__accordion-content">
                      <ul>${product.care.map(c => `<li>${c}</li>`).join('')}</ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      bindPdpEvents();
    }

    function bindPdpEvents() {
      // Color swatches — set bg color
      app.querySelectorAll('.pdp__color-swatch').forEach(swatch => {
        const colorObj = product.colors.find(c => c.name === swatch.dataset.color);
        if (colorObj) {
          swatch.style.setProperty('--swatch-color', colorObj.hex);
          const inner = swatch.querySelector('span');
          if (inner) {
            inner.style.display = 'block';
            inner.style.width = '24px';
            inner.style.height = '24px';
            inner.style.borderRadius = '50%';
            inner.style.background = colorObj.hex;
            inner.style.border = colorObj.hex === '#ffffff' ? '1px solid #e0e0e0' : '1px solid ' + colorObj.hex;
          }
        }
      });

      // Color click
      app.querySelectorAll('.pdp__color-swatch').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedColor = btn.dataset.color;
          addedMsg = '';
          render();
        });
      });

      // Size click
      app.querySelectorAll('.pdp__size:not(.is-disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedSize = btn.dataset.size;
          sizeError = '';
          addedMsg = '';
          render();
        });
      });

      // Qty
      const qtyMinus = document.getElementById('pdpQtyMinus');
      const qtyPlus  = document.getElementById('pdpQtyPlus');
      if (qtyMinus) qtyMinus.addEventListener('click', () => { if (qty > 1) { qty--; addedMsg = ''; render(); } });
      if (qtyPlus)  qtyPlus.addEventListener('click',  () => { if (qty < 10) { qty++; addedMsg = ''; render(); } });

      // Add to cart
      const addBtn = document.getElementById('pdpAddBtn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          if (!selectedSize) {
            sizeError = 'Please select a size';
            addedMsg = '';
            render();
            return;
          }
          addToCart(product.id, selectedColor, selectedSize, qty);
          addedMsg = `Added ${qty}× ${product.name} to your cart`;
          sizeError = '';
          render();
        });
      }

      // Thumbs
      app.querySelectorAll('.pdp__thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          app.querySelectorAll('.pdp__thumb').forEach(t => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
        });
      });

      // Accordion
      app.querySelectorAll('.pdp__accordion-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.closest('.pdp__accordion-item').classList.toggle('is-expanded');
        });
      });
    }

    render();
  }

  /* -----------------------------------------------
     CHECKOUT PAGE
     ----------------------------------------------- */
  function renderCheckoutPage() {
    if (cart.length === 0) {
      location.hash = '#/';
      return;
    }

    const subtotal = getCartTotal();
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    app.innerHTML = `
      <div class="checkout">
        <a href="#/" class="checkout__back">← Continue Shopping</a>
        <h1 class="checkout__title">Checkout</h1>

        <div class="checkout__grid">
          <!-- Form -->
          <div class="checkout__form">
            <div class="form-section">
              <h3 class="form-section__title">Contact</h3>
              <div class="form-row">
                <div class="form-field">
                  <label for="email">Email</label>
                  <input type="email" id="email" placeholder="your@email.com" required>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="form-section__title">Shipping Address</h3>
              <div class="form-row form-row--2">
                <div class="form-field">
                  <label for="firstName">First Name</label>
                  <input type="text" id="firstName" placeholder="John" required>
                </div>
                <div class="form-field">
                  <label for="lastName">Last Name</label>
                  <input type="text" id="lastName" placeholder="Doe" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label for="address">Address</label>
                  <input type="text" id="address" placeholder="Street address" required>
                </div>
              </div>
              <div class="form-row form-row--3">
                <div class="form-field">
                  <label for="city">City</label>
                  <input type="text" id="city" placeholder="Berlin" required>
                </div>
                <div class="form-field">
                  <label for="postal">Postal Code</label>
                  <input type="text" id="postal" placeholder="10115" required>
                </div>
                <div class="form-field">
                  <label for="country">Country</label>
                  <select id="country">
                    <option value="DE">Germany</option>
                    <option value="AT">Austria</option>
                    <option value="CH">Switzerland</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="ES">Spain</option>
                    <option value="PT">Portugal</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="form-section__title">Payment</h3>
              <div class="form-row">
                <div class="form-field">
                  <label for="cardNumber">Card Number</label>
                  <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
              </div>
              <div class="form-row form-row--2">
                <div class="form-field">
                  <label for="expiry">Expiry</label>
                  <input type="text" id="expiry" placeholder="MM / YY" maxlength="7" required>
                </div>
                <div class="form-field">
                  <label for="cvc">CVC</label>
                  <input type="text" id="cvc" placeholder="123" maxlength="4" required>
                </div>
              </div>
            </div>

            <button class="btn btn--primary btn--full" id="placeOrderBtn">Place Order — €${total}</button>
          </div>

          <!-- Sidebar Summary -->
          <div class="checkout-summary">
            <h3 class="checkout-summary__title">Order Summary</h3>
            ${cart.map(item => {
              const p = PRODUCTS.find(pr => pr.id === item.productId);
              if (!p) return '';
              const num = String(p.id).padStart(2, '0');
              return `
                <div class="checkout-summary__item">
                  <div class="checkout-summary__thumb">${num}</div>
                  <div>
                    <div class="checkout-summary__item-name">${p.name}</div>
                    <div class="checkout-summary__item-variant">${item.color} / ${item.size}</div>
                    <div class="checkout-summary__item-qty">Qty: ${item.qty}</div>
                  </div>
                  <div class="checkout-summary__item-price">€${p.price * item.qty}</div>
                </div>`;
            }).join('')}

            <div class="checkout-summary__totals">
              <div class="checkout-summary__row"><span>Subtotal</span><span>€${subtotal}</span></div>
              <div class="checkout-summary__row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '€' + shipping}</span></div>
              <div class="checkout-summary__row checkout-summary__row--total"><span>Total</span><span>€${total}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Card number formatting
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
      cardInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
      });
    }

    // Expiry formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 2) v = v.substring(0,2) + ' / ' + v.substring(2);
        e.target.value = v;
      });
    }

    // Place Order
    const placeBtn = document.getElementById('placeOrderBtn');
    if (placeBtn) {
      placeBtn.addEventListener('click', () => {
        const fields = ['email','firstName','lastName','address','city','postal','cardNumber','expiry','cvc'];
        let valid = true;

        fields.forEach(id => {
          const el = document.getElementById(id);
          if (el && !el.value.trim()) {
            el.classList.add('is-error');
            valid = false;
          } else if (el) {
            el.classList.remove('is-error');
          }
        });

        if (!valid) return;

        // Store order info for success page
        const orderTotal = total;
        const orderItems = getCartItemCount();
        sessionStorage.setItem('essence_order', JSON.stringify({
          number: 'ES-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          email: document.getElementById('email').value,
          total: orderTotal,
          items: orderItems,
          shipping: shipping
        }));

        clearCart();
        location.hash = '#/success';
      });
    }
  }

  /* -----------------------------------------------
     SUCCESS PAGE
     ----------------------------------------------- */
  function renderSuccessPage() {
    const orderData = JSON.parse(sessionStorage.getItem('essence_order') || '{}');
    const orderNumber = orderData.number || 'ES-000000';
    const orderEmail  = orderData.email  || 'your@email.com';
    const orderTotal  = orderData.total  || 0;
    const orderItems  = orderData.items  || 0;
    const orderShip   = orderData.shipping === 0 ? 'Free' : '€' + (orderData.shipping || SHIPPING_COST);

    app.innerHTML = `
      <div class="success">
        <div class="success__inner">
          <div class="success__check">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="8 16 14 22 24 10"/>
            </svg>
          </div>
          <h1 class="success__title">Thank You</h1>
          <p class="success__order-number">Order ${orderNumber}</p>
          <p class="success__text">
            Your order has been confirmed and will be shipped within 2–4 business days.
            A confirmation email has been sent to <strong>${orderEmail}</strong>.
          </p>
          <div class="success__details">
            <div class="success__details-row">
              <span class="success__details-label">Order Number</span>
              <span class="success__details-value">${orderNumber}</span>
            </div>
            <div class="success__details-row">
              <span class="success__details-label">Items</span>
              <span class="success__details-value">${orderItems}</span>
            </div>
            <div class="success__details-row">
              <span class="success__details-label">Shipping</span>
              <span class="success__details-value">${orderShip}</span>
            </div>
            <div class="success__details-row">
              <span class="success__details-label">Total</span>
              <span class="success__details-value">€${orderTotal}</span>
            </div>
          </div>
          <a href="#/" class="btn btn--primary">Continue Shopping</a>
        </div>
      </div>
    `;

    sessionStorage.removeItem('essence_order');
  }

  /* -----------------------------------------------
     SCROLL REVEAL
     ----------------------------------------------- */
  function initRevealAnimations() {
    const selectors = '.category-card,.product-card,.editorial__right,.newsletter__inner,.footer__grid';
    const els = app.querySelectorAll(selectors);
    if (!els.length) return;

    els.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    els.forEach(el => observer.observe(el));
  }

  /* -----------------------------------------------
     INIT
     ----------------------------------------------- */
  updateCartCount();
  navigate();

})();
