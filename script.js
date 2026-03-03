/* ===================================================
   ÈSSENCE — Contemporary E-Commerce SPA v2
   Products-first · Glassmorphic categories · Angular
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
      colors: [{ name: 'Black', hex: '#111111' }],
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
    },
    {
      id: 7, slug: 'relaxed-knit-polo',
      name: 'Relaxed Knit Polo', price: 120,
      category: 'Clothing',
      colors: [
        { name: 'Cream', hex: '#f0ebe0' },
        { name: 'Black', hex: '#111111' }
      ],
      sizes: ['S','M','L','XL'],
      disabledSizes: [],
      description: 'A textured knit polo in a relaxed silhouette. Open collar, ribbed trim, and a dry hand-feel in cotton-linen blend.',
      details: ['60% cotton, 40% linen', 'Relaxed fit', 'Johnny collar', 'Made in Portugal'],
      care: ['Hand wash cold', 'Lay flat to dry', 'Do not wring']
    },
    {
      id: 8, slug: 'leather-crossbody',
      name: 'Leather Crossbody', price: 245,
      category: 'Bags',
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Tan',   hex: '#b5956b' }
      ],
      sizes: ['One Size'],
      disabledSizes: [],
      description: 'A compact crossbody in full-grain leather. Clean lines, magnetic closure, and an adjustable strap for versatile carry.',
      details: ['Full-grain Italian leather', '22 × 16 × 6 cm', 'Magnetic flap closure', 'Interior card slots', 'Adjustable strap', 'Made in Italy'],
      care: ['Wipe with dry cloth', 'Condition leather quarterly', 'Avoid contact with water']
    }
  ];

  const CATEGORIES = [
    { key: 'all',       label: 'All',       icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
    { key: 'Clothing',  label: 'Clothing',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 4L12 2l6 2v6l-3-1.5V20H9V10.5L6 12V4z"/></svg>' },
    { key: 'Shoes',     label: 'Shoes',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 16s1-5 6-5 5 3 9 3c2.5 0 3-1 3-1v4H3z"/></svg>' },
    { key: 'Bags',      label: 'Bags',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="9" width="16" height="12" rx="1"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>' },
  ];

  const SHIPPING_COST = 12;
  const FREE_SHIPPING_THRESHOLD = 250;

  /* -----------------------------------------------
     STATE
     ----------------------------------------------- */
  let activeCategory = 'all';
  let cart = JSON.parse(localStorage.getItem('essence_cart') || '[]');

  function saveCart() {
    localStorage.setItem('essence_cart', JSON.stringify(cart));
    updateCartCount();
  }
  function addToCart(productId, color, size, qty = 1) {
    const existing = cart.find(i => i.productId === productId && i.color === color && i.size === size);
    if (existing) existing.qty += qty;
    else cart.push({ productId, color, size, qty });
    saveCart();
  }
  function updateCartQty(index, qty) {
    if (qty <= 0) cart.splice(index, 1);
    else cart[index].qty = qty;
    saveCart();
  }
  function removeCartItem(index) { cart.splice(index, 1); saveCart(); }
  function getCartTotal() {
    return cart.reduce((s, i) => { const p = PRODUCTS.find(pr => pr.id === i.productId); return s + (p ? p.price * i.qty : 0); }, 0);
  }
  function getCartItemCount() { return cart.reduce((s, i) => s + i.qty, 0); }
  function clearCart() { cart = []; saveCart(); }

  /* -----------------------------------------------
     DOM
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
  menuToggle.addEventListener('click', () => sideMenu.classList.contains('is-open') ? closeMenu() : openMenu());
  menuOverlay.addEventListener('click', closeMenu);
  sideMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
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
    const c = getCartItemCount();
    cartCountEl.textContent = c;
  }

  function renderCartDrawer() {
    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-drawer__empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="opacity:.3"><rect x="5" y="9" width="14" height="12" rx="1"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>
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

    cartFooter.innerHTML = `
      <div class="cart-summary-row"><span>Subtotal</span><span>€${subtotal}</span></div>
      <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '€' + shipping}</span></div>
      <div class="cart-summary-row cart-summary-row--total"><span>Total</span><span>€${subtotal + shipping}</span></div>
      <a href="#/checkout" class="btn btn--primary btn--full" id="drawerCheckoutBtn">Checkout</a>`;

    cartBody.querySelectorAll('[data-cart-qty]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.cartQty);
        updateCartQty(idx, cart[idx].qty + parseInt(btn.dataset.delta));
        renderCartDrawer();
      });
    });
    cartBody.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', () => { removeCartItem(parseInt(btn.dataset.cartRemove)); renderCartDrawer(); });
    });
    const cb = document.getElementById('drawerCheckoutBtn');
    if (cb) cb.addEventListener('click', closeCart);
  }

  /* -----------------------------------------------
     KEYBOARD
     ----------------------------------------------- */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeCart(); } });

  /* -----------------------------------------------
     ROUTER
     ----------------------------------------------- */
  function getRoute() { return location.hash || '#/'; }

  function navigate() {
    const hash = getRoute();
    window.scrollTo(0, 0);

    if (hash.startsWith('#/product/')) renderProductPage(parseInt(hash.split('/')[2]));
    else if (hash === '#/checkout') renderCheckoutPage();
    else if (hash === '#/success') renderSuccessPage();
    else renderHomePage();

    initRevealAnimations();
  }
  window.addEventListener('hashchange', navigate);

  /* -----------------------------------------------
     HOME PAGE
     ----------------------------------------------- */
  function renderHomePage() {
    const filtered = activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === activeCategory);

    app.innerHTML = `
      <div style="margin-top:56px">
        <!-- Mini Banner -->
        <div class="mini-banner">
          <div class="mini-banner__inner">
            <div class="mini-banner__text">
              <strong>SS26 Collection</strong>
              New arrivals — refined essentials for modern living
            </div>
            <button class="mini-banner__btn">Shop Now</button>
          </div>
        </div>

        <!-- Category Bubbles -->
        <div class="category-bar" id="categoryBar">
          ${CATEGORIES.map(cat => `
            <button class="cat-bubble ${activeCategory === cat.key ? 'is-active' : ''}" data-cat="${cat.key}">
              <span class="cat-bubble__icon">${cat.icon}</span>
              ${cat.label}
            </button>
          `).join('')}
        </div>

        <!-- Grid Header -->
        <div class="grid-header">
          <span class="grid-header__title">${activeCategory === 'all' ? 'All Products' : activeCategory}</span>
          <span class="grid-header__count">${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}</span>
        </div>

        <!-- Product Grid -->
        <div class="product-grid">
          ${filtered.map(p => {
            const num = String(p.id).padStart(2, '0');
            return `
              <article class="product-card" data-product-id="${p.id}">
                <div class="product-card__image-wrap">
                  <div class="product-card__image">${num}</div>
                  <button class="product-card__quick" data-quick-add="${p.id}" aria-label="Quick add">+</button>
                </div>
                <div class="product-card__meta">
                  <span class="product-card__name">${p.name}</span>
                  <span class="product-card__price">€${p.price}</span>
                </div>
                <div class="product-card__colors">
                  ${p.colors.map(c => `<span class="swatch" style="background:${c.hex};${c.hex === '#ffffff' || c.hex === '#f0ebe0' ? 'border-color:#d4d2cc' : 'border-color:' + c.hex}" title="${c.name}"></span>`).join('')}
                </div>
              </article>`;
          }).join('')}
        </div>

        <!-- Editorial -->
        <div class="editorial-strip">
          <div class="editorial-card editorial-card--dark">
            <div class="editorial-card__content">
              <p class="editorial-card__eyebrow">Our Philosophy</p>
              <h3 class="editorial-card__title">Less, but<br>better.</h3>
            </div>
          </div>
          <div class="editorial-card">
            <div class="editorial-card__content">
              <p class="editorial-card__eyebrow">Sustainability</p>
              <h3 class="editorial-card__title">Made to<br>last.</h3>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer__inner">
            <div class="footer__grid">
              <div class="footer__col">
                <a href="#/" class="logo logo--footer">ÈSSENCE</a>
                <p class="footer__tagline">Contemporary essentials<br>for modern living.</p>
              </div>
              <div class="footer__col">
                <h4 class="footer__heading">Shop</h4>
                <ul><li><a href="#/">Clothing</a></li><li><a href="#/">Shoes</a></li><li><a href="#/">Bags</a></li></ul>
              </div>
              <div class="footer__col">
                <h4 class="footer__heading">Info</h4>
                <ul><li><a href="#">About</a></li><li><a href="#">Sustainability</a></li><li><a href="#">Shipping</a></li></ul>
              </div>
              <div class="footer__col">
                <h4 class="footer__heading">Connect</h4>
                <ul><li><a href="#">Instagram</a></li><li><a href="#">Pinterest</a></li><li><a href="#">Contact</a></li></ul>
              </div>
            </div>
            <div class="footer__bottom">
              <span>&copy; 2026 ÈSSENCE</span>
              <div class="footer__bottom-links"><a href="#">Privacy</a><a href="#">Terms</a></div>
            </div>
          </div>
        </footer>
      </div>`;

    // Category filter
    app.querySelectorAll('.cat-bubble').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        renderHomePage();
        initRevealAnimations();
      });
    });

    // Product card → detail
    app.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.product-card__quick')) return;
        location.hash = `#/product/${card.dataset.productId}`;
      });
    });

    // Quick-add
    app.querySelectorAll('[data-quick-add]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const p = PRODUCTS.find(pr => pr.id === parseInt(btn.dataset.quickAdd));
        if (!p) return;
        const color = p.colors[0].name;
        const size = p.sizes.find(s => !p.disabledSizes.includes(s)) || p.sizes[0];
        addToCart(p.id, color, size, 1);
        btn.textContent = '✓';
        btn.style.background = 'var(--black)';
        btn.style.color = 'var(--white)';
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
        setTimeout(() => {
          btn.textContent = '+';
          btn.style.background = '';
          btn.style.color = '';
          btn.style.opacity = '';
          btn.style.transform = '';
        }, 1000);
      });
    });
  }

  /* -----------------------------------------------
     PRODUCT DETAIL
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
          <a href="#/" class="pdp__back">← Back</a>
          <div class="pdp__grid">
            <div class="pdp__gallery">
              <div class="pdp__image-main">${num}</div>
              <div class="pdp__thumbs">
                ${[1,2,3,4].map((n, i) => `<div class="pdp__thumb ${i === 0 ? 'is-active' : ''}" data-thumb="${i}">${num}.${n}</div>`).join('')}
              </div>
            </div>
            <div class="pdp__info">
              <p class="pdp__category">${product.category}</p>
              <h1 class="pdp__name">${product.name}</h1>
              <p class="pdp__price">€${product.price}</p>

              <p class="pdp__section-label">Color</p>
              <div class="pdp__colors">
                ${product.colors.map(c => `
                  <button class="pdp__color-swatch ${c.name === selectedColor ? 'is-active' : ''}" data-color="${c.name}" title="${c.name}">
                    <span class="pdp__color-inner" style="background:${c.hex};${c.hex === '#ffffff' || c.hex === '#f0ebe0' ? 'border:1px solid #d4d2cc' : ''}"></span>
                  </button>
                `).join('')}
              </div>
              <p class="pdp__color-name">${selectedColor}</p>

              <p class="pdp__section-label">Size</p>
              <div class="pdp__sizes">
                ${product.sizes.map(s => {
                  const disabled = product.disabledSizes.includes(s);
                  return `<button class="pdp__size ${s === selectedSize ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''}" data-size="${s}" ${disabled ? 'disabled' : ''}>${s}</button>`;
                }).join('')}
              </div>
              <p class="pdp__size-error">${sizeError}</p>

              <div class="pdp__add-row">
                <div class="qty-control">
                  <button id="pdpQtyMinus">−</button>
                  <span class="qty-control__value" id="pdpQtyVal">${qty}</span>
                  <button id="pdpQtyPlus">+</button>
                </div>
                <button class="btn btn--primary pdp__add-btn" id="pdpAddBtn">Add to Cart — €${product.price * qty}</button>
              </div>
              <p class="pdp__added-msg">${addedMsg}</p>

              <div class="pdp__accordion">
                <div class="pdp__accordion-item is-expanded">
                  <button class="pdp__accordion-toggle"><span>Description</span><span class="menu-plus"></span></button>
                  <div class="pdp__accordion-body"><div class="pdp__accordion-content">${product.description}</div></div>
                </div>
                <div class="pdp__accordion-item">
                  <button class="pdp__accordion-toggle"><span>Details</span><span class="menu-plus"></span></button>
                  <div class="pdp__accordion-body"><div class="pdp__accordion-content"><ul>${product.details.map(d => `<li>${d}</li>`).join('')}</ul></div></div>
                </div>
                <div class="pdp__accordion-item">
                  <button class="pdp__accordion-toggle"><span>Care</span><span class="menu-plus"></span></button>
                  <div class="pdp__accordion-body"><div class="pdp__accordion-content"><ul>${product.care.map(c => `<li>${c}</li>`).join('')}</ul></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      bindPdpEvents();
    }

    function bindPdpEvents() {
      app.querySelectorAll('.pdp__color-swatch').forEach(btn => {
        btn.addEventListener('click', () => { selectedColor = btn.dataset.color; addedMsg = ''; render(); });
      });
      app.querySelectorAll('.pdp__size:not(.is-disabled)').forEach(btn => {
        btn.addEventListener('click', () => { selectedSize = btn.dataset.size; sizeError = ''; addedMsg = ''; render(); });
      });
      const qm = document.getElementById('pdpQtyMinus');
      const qp = document.getElementById('pdpQtyPlus');
      if (qm) qm.addEventListener('click', () => { if (qty > 1) { qty--; addedMsg = ''; render(); } });
      if (qp) qp.addEventListener('click', () => { if (qty < 10) { qty++; addedMsg = ''; render(); } });

      const addBtn = document.getElementById('pdpAddBtn');
      if (addBtn) addBtn.addEventListener('click', () => {
        if (!selectedSize) { sizeError = 'Please select a size'; addedMsg = ''; render(); return; }
        addToCart(product.id, selectedColor, selectedSize, qty);
        addedMsg = `Added ${qty}× ${product.name} to your cart`;
        sizeError = '';
        render();
      });

      app.querySelectorAll('.pdp__thumb').forEach(t => {
        t.addEventListener('click', () => { app.querySelectorAll('.pdp__thumb').forEach(x => x.classList.remove('is-active')); t.classList.add('is-active'); });
      });
      app.querySelectorAll('.pdp__accordion-toggle').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.pdp__accordion-item').classList.toggle('is-expanded'));
      });
    }

    render();
  }

  /* -----------------------------------------------
     CHECKOUT
     ----------------------------------------------- */
  function renderCheckoutPage() {
    if (cart.length === 0) { location.hash = '#/'; return; }

    const subtotal = getCartTotal();
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    app.innerHTML = `
      <div class="checkout">
        <a href="#/" class="checkout__back">← Continue Shopping</a>
        <h1 class="checkout__title">Checkout</h1>
        <div class="checkout__grid">
          <div>
            <div class="form-section">
              <h3 class="form-section__title">Contact</h3>
              <div class="form-row"><div class="form-field"><label for="email">Email</label><input type="email" id="email" placeholder="your@email.com" required></div></div>
            </div>
            <div class="form-section">
              <h3 class="form-section__title">Shipping Address</h3>
              <div class="form-row form-row--2">
                <div class="form-field"><label for="firstName">First Name</label><input type="text" id="firstName" placeholder="John" required></div>
                <div class="form-field"><label for="lastName">Last Name</label><input type="text" id="lastName" placeholder="Doe" required></div>
              </div>
              <div class="form-row"><div class="form-field"><label for="address">Address</label><input type="text" id="address" placeholder="Street address" required></div></div>
              <div class="form-row form-row--3">
                <div class="form-field"><label for="city">City</label><input type="text" id="city" placeholder="Berlin" required></div>
                <div class="form-field"><label for="postal">Postal Code</label><input type="text" id="postal" placeholder="10115" required></div>
                <div class="form-field"><label for="country">Country</label>
                  <select id="country"><option value="DE">Germany</option><option value="AT">Austria</option><option value="CH">Switzerland</option><option value="FR">France</option><option value="IT">Italy</option><option value="NL">Netherlands</option><option value="ES">Spain</option><option value="UK">United Kingdom</option></select>
                </div>
              </div>
            </div>
            <div class="form-section">
              <h3 class="form-section__title">Payment</h3>
              <div class="form-row"><div class="form-field"><label for="cardNumber">Card Number</label><input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required></div></div>
              <div class="form-row form-row--2">
                <div class="form-field"><label for="expiry">Expiry</label><input type="text" id="expiry" placeholder="MM / YY" maxlength="7" required></div>
                <div class="form-field"><label for="cvc">CVC</label><input type="text" id="cvc" placeholder="123" maxlength="4" required></div>
              </div>
            </div>
            <button class="btn btn--primary btn--full" id="placeOrderBtn">Place Order — €${total}</button>
          </div>
          <div class="checkout-summary">
            <h3 class="checkout-summary__title">Order Summary</h3>
            ${cart.map(item => {
              const p = PRODUCTS.find(pr => pr.id === item.productId);
              if (!p) return '';
              return `<div class="checkout-summary__item">
                <div class="checkout-summary__thumb">${String(p.id).padStart(2,'0')}</div>
                <div><div class="checkout-summary__item-name">${p.name}</div><div class="checkout-summary__item-variant">${item.color} / ${item.size}</div><div class="checkout-summary__item-qty">Qty: ${item.qty}</div></div>
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
      </div>`;

    const cardInput = document.getElementById('cardNumber');
    if (cardInput) cardInput.addEventListener('input', e => { let v = e.target.value.replace(/\D/g,'').substring(0,16); e.target.value = v.replace(/(.{4})/g,'$1 ').trim(); });
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) expiryInput.addEventListener('input', e => { let v = e.target.value.replace(/\D/g,'').substring(0,4); if (v.length >= 2) v = v.substring(0,2) + ' / ' + v.substring(2); e.target.value = v; });

    const placeBtn = document.getElementById('placeOrderBtn');
    if (placeBtn) placeBtn.addEventListener('click', () => {
      const fields = ['email','firstName','lastName','address','city','postal','cardNumber','expiry','cvc'];
      let valid = true;
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) { el.classList.add('is-error'); valid = false; } else if (el) el.classList.remove('is-error');
      });
      if (!valid) return;
      sessionStorage.setItem('essence_order', JSON.stringify({
        number: 'ES-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        email: document.getElementById('email').value,
        total, items: getCartItemCount(), shipping
      }));
      clearCart();
      location.hash = '#/success';
    });
  }

  /* -----------------------------------------------
     SUCCESS
     ----------------------------------------------- */
  function renderSuccessPage() {
    const o = JSON.parse(sessionStorage.getItem('essence_order') || '{}');
    app.innerHTML = `
      <div class="success">
        <div class="success__inner">
          <div class="success__check">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 16 14 22 24 10"/></svg>
          </div>
          <h1 class="success__title">Thank You</h1>
          <p class="success__order-number">Order ${o.number || 'ES-000000'}</p>
          <p class="success__text">Your order has been confirmed and will ship within 2–4 business days. Confirmation sent to <strong>${o.email || ''}</strong>.</p>
          <div class="success__details">
            <div class="success__details-row"><span class="success__details-label">Order</span><span class="success__details-value">${o.number || ''}</span></div>
            <div class="success__details-row"><span class="success__details-label">Items</span><span class="success__details-value">${o.items || 0}</span></div>
            <div class="success__details-row"><span class="success__details-label">Shipping</span><span class="success__details-value">${o.shipping === 0 ? 'Free' : '€' + (o.shipping || SHIPPING_COST)}</span></div>
            <div class="success__details-row"><span class="success__details-label">Total</span><span class="success__details-value">€${o.total || 0}</span></div>
          </div>
          <a href="#/" class="btn btn--primary">Continue Shopping</a>
        </div>
      </div>`;
    sessionStorage.removeItem('essence_order');
  }

  /* -----------------------------------------------
     REVEAL ANIMATIONS
     ----------------------------------------------- */
  function initRevealAnimations() {
    const els = app.querySelectorAll('.product-card,.editorial-card,.footer__grid');
    if (!els.length) return;
    els.forEach(el => el.classList.add('reveal'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 50);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    els.forEach(el => obs.observe(el));
  }

  /* -----------------------------------------------
     INIT
     ----------------------------------------------- */
  updateCartCount();
  navigate();

})();
