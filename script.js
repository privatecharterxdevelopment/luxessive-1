/* ===================================================
   LUXESSIVE — Ultra Minimal Gallery Commerce
   Split-screen · Floating products · Dot nav
   =================================================== */

(() => {
  'use strict';

  let PRODUCTS = [];

  const SHIPPING = 12;
  const FREE_SHIP = 250;

  // Categories for the split hero panels
  const LEFT_CATS = [
    { label: 'All Products', filter: 'all', active: true },
    { label: 'Clothing', filter: 'Clothing', active: false },
    { label: 'Shoes', filter: 'Shoes', active: false },
  ];
  const RIGHT_CATS = [
    { label: 'Bags', filter: 'Bags', active: false },
    { label: 'New Arrivals', filter: 'all', active: true },
  ];

  /* ---- State ---- */
  let cart = JSON.parse(localStorage.getItem('luxessive_cart') || '[]');
  let activeFilter = 'all';
  let heroLeftIdx = 0;  // which product is shown on left panel
  let heroRightIdx = 0;

  function saveCart() { localStorage.setItem('luxessive_cart', JSON.stringify(cart)); updateCartCount(); }
  function addToCart(pid, color, size, qty = 1) {
    const ex = cart.find(i => i.productId === pid && i.color === color && i.size === size);
    if (ex) ex.qty += qty; else cart.push({ productId: pid, color, size, qty });
    saveCart();
  }
  function updateCartQty(i, q) { if (q <= 0) cart.splice(i, 1); else cart[i].qty = q; saveCart(); }
  function removeCartItem(i) { cart.splice(i, 1); saveCart(); }
  function cartTotal() { return cart.reduce((s, i) => { const p = PRODUCTS.find(x => x.id === i.productId); return s + (p ? p.price * i.qty : 0); }, 0); }
  function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
  function clearCart() { cart = []; saveCart(); }

  /* ---- DOM ---- */
  const app = document.getElementById('app');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartBody = document.getElementById('cartBody');
  const cartFooter = document.getElementById('cartFooter');

  /* ---- Cart Drawer ---- */
  function openCart() {
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
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  function updateCartCount() {
    document.querySelectorAll('.js-cart-count').forEach(el => { el.textContent = cartCount(); });
  }

  function renderCartDrawer() {
    if (!cart.length) {
      cartBody.innerHTML = `<div class="cart-drawer__empty"><p>Your cart is empty</p><a href="#/" class="pill pill--outline" onclick="document.getElementById('cartDrawer').classList.remove('is-open');document.getElementById('cartOverlay').classList.remove('is-visible');document.body.style.overflow=''">Continue Shopping</a></div>`;
      cartFooter.classList.add('is-hidden');
      return;
    }
    cartFooter.classList.remove('is-hidden');
    cartBody.innerHTML = cart.map((item, i) => {
      const p = PRODUCTS.find(x => x.id === item.productId);
      if (!p) return '';
      return `<div class="cart-item"><div class="cart-item__image">${String(p.id).padStart(2,'0')}</div><div class="cart-item__details"><div><div class="cart-item__name">${p.name}</div><div class="cart-item__variant">${item.color} / ${item.size}</div></div><div class="cart-item__bottom"><div class="qty-control"><button data-cq="${i}" data-d="-1">−</button><span class="qty-control__value">${item.qty}</span><button data-cq="${i}" data-d="1">+</button></div><span class="cart-item__price">€${p.price * item.qty}</span></div><button class="cart-item__remove" data-cr="${i}">Remove</button></div></div>`;
    }).join('');

    const sub = cartTotal();
    const ship = sub >= FREE_SHIP ? 0 : SHIPPING;
    cartFooter.innerHTML = `<div class="cart-summary-row"><span>Subtotal</span><span>€${sub}</span></div><div class="cart-summary-row"><span>Shipping</span><span>${ship ? '€' + ship : 'Free'}</span></div><div class="cart-summary-row cart-summary-row--total"><span>Total</span><span>€${sub + ship}</span></div><a href="#/checkout" class="pill pill--dark pill--full" id="dCO">Checkout</a>`;

    cartBody.querySelectorAll('[data-cq]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.cq; updateCartQty(i, cart[i].qty + +b.dataset.d); renderCartDrawer(); }));
    cartBody.querySelectorAll('[data-cr]').forEach(b => b.addEventListener('click', () => { removeCartItem(+b.dataset.cr); renderCartDrawer(); }));
    document.getElementById('dCO')?.addEventListener('click', closeCart);
  }

  /* ---- Router ---- */
  function navigate() {
    const h = location.hash || '#/';
    window.scrollTo(0, 0);
    if (h.startsWith('#/product/')) renderPDP(+h.split('/')[2]);
    else if (h.startsWith('#/shop')) {
      const cat = decodeURIComponent(h.split('/')[2] || '');
      activeFilter = cat || 'all';
      renderShop();
    }
    else if (h === '#/checkout') renderCheckout();
    else if (h === '#/success') renderSuccess();
    else renderHome();
  }
  window.addEventListener('hashchange', navigate);

  /* ---- Helpers ---- */
  const num = id => String(id).padStart(2, '0');
  const swatchBorder = hex => (hex === '#ffffff' || hex === '#f0ebe0') ? '#d4d2cc' : hex;

  // Products for hero panels (rebuilt after API fetch)
  let leftShowcase = [];
  let rightShowcase = [];

  function buildShowcase() {
    const clothing = PRODUCTS.filter(p => p.category === 'Clothing');
    const shoes = PRODUCTS.filter(p => p.category === 'Shoes');
    const bags = PRODUCTS.filter(p => p.category === 'Bags');
    leftShowcase = [clothing[0], shoes[0], clothing[1]].filter(Boolean);
    rightShowcase = [bags[0], bags[1], shoes[1]].filter(Boolean);
  }

  /* ==================================================
     HOME
     ================================================== */
  function renderHome() {
    const lp = leftShowcase[heroLeftIdx] || null;
    const rp = rightShowcase[heroRightIdx] || null;
    const filtered = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);

    app.innerHTML = `
      <!-- Split Hero -->
      <div class="split-hero">
        <!-- Left Panel -->
        <div class="split-panel">
          <div class="panel-top">
            <span class="panel-label">LUXESSIVE Products</span>
            <a href="#/shop" class="panel-link"><span class="dot"></span> Shop</a>
          </div>
          <div class="panel-nav">
            ${LEFT_CATS.map((c, i) => `<a href="#/shop${c.filter === 'all' ? '' : '/' + c.filter}" class="panel-nav__item ${c.filter === activeFilter ? 'is-active' : ''}"><span class="dot"></span> ${c.label}</a>`).join('')}
          </div>
          <div class="panel-showcase" ${lp ? `data-goto="${lp.id}"` : ''}>
            ${lp ? `<div class="showcase-product">
              <div class="showcase-image">${num(lp.id)}</div>
              <div class="showcase-name">${lp.name}</div>
              <div class="showcase-price">€${lp.price}</div>
            </div>` : ''}
          </div>
          <div class="panel-bottom">
            ${lp ? `<a class="pill pill--dark" data-goto="${lp.id}">Learn More</a>` : ''}
            <div class="progress-dots">
              ${leftShowcase.map((_, i) => `<div class="progress-dash ${i === heroLeftIdx ? 'is-active' : ''}" data-lidx="${i}"></div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="split-panel split-panel--right">
          <div class="panel-top">
            <span class="panel-label">Bags & Accessories</span>
            <a href="#/shop" class="panel-link"><span class="dot"></span> Discover</a>
          </div>
          <div class="panel-nav">
            ${RIGHT_CATS.map((c, i) => `<a href="#/shop${c.filter === 'all' ? '' : '/' + c.filter}" class="panel-nav__item ${c.filter === activeFilter ? 'is-active' : ''}"><span class="dot"></span> ${c.label}</a>`).join('')}
          </div>
          <div class="panel-showcase" ${rp ? `data-goto="${rp.id}"` : ''}>
            ${rp ? `<div class="showcase-product">
              <div class="showcase-image">${num(rp.id)}</div>
              <div class="showcase-name">${rp.name}</div>
              <div class="showcase-price">€${rp.price}</div>
            </div>` : ''}
          </div>
          <div class="panel-bottom">
            ${rp ? `<a class="pill pill--dark" data-goto="${rp.id}">Learn More</a>` : ''}
            <div class="progress-dots">
              ${rightShowcase.map((_, i) => `<div class="progress-dash ${i === heroRightIdx ? 'is-active' : ''}" data-ridx="${i}"></div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Shop Grid -->
      <section class="shop-section">
        <div class="shop-header">
          <div class="shop-header__left">
            <span class="shop-header__title">Shop</span>
            <div class="shop-filters">
              ${['all','Clothing','Shoes','Bags'].map(f => `<button class="filter-pill ${activeFilter === f ? 'is-active' : ''}" data-filter="${f}">${f === 'all' ? 'All' : f}</button>`).join('')}
            </div>
          </div>
          <span class="shop-header__count">${filtered.length} pieces</span>
        </div>
        <div class="shop-grid">
          ${filtered.map(p => `
            <article class="shop-card" data-pid="${p.id}">
              <div class="shop-card__image">
                ${num(p.id)}
                <button class="shop-card__add" data-qa="${p.id}" aria-label="Quick add">+</button>
              </div>
              <div class="shop-card__meta">
                <span class="shop-card__name">${p.name}</span>
                <span class="shop-card__price">€${p.price}</span>
              </div>
              <div class="shop-card__colors">
                ${p.colors.map(c => `<span class="swatch" style="background:${c.hex};border-color:${swatchBorder(c.hex)}" title="${c.name}"></span>`).join('')}
              </div>
            </article>
          `).join('')}
        </div>

        <!-- Cart button row -->
        <div style="max-width:1400px;margin:0 auto;padding:32px 36px 0;display:flex;justify-content:flex-end">
          <button class="pill pill--outline" id="homeCartBtn">
            <span class="dot" style="background:var(--black)"></span>
            Cart (<span class="js-cart-count">${cartCount()}</span>)
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="site-footer">
        <span>&copy; 2026 LUXESSIVE</span>
        <div class="site-footer__links">
          <a href="#">Instagram</a>
          <a href="#">About</a>
          <a href="#">Shipping</a>
          <a href="#">Privacy</a>
        </div>
      </footer>
    `;

    // Bind events
    // Progress dashes — left
    app.querySelectorAll('[data-lidx]').forEach(d => d.addEventListener('click', () => {
      heroLeftIdx = +d.dataset.lidx;
      renderHome();
    }));
    // Progress dashes — right
    app.querySelectorAll('[data-ridx]').forEach(d => d.addEventListener('click', () => {
      heroRightIdx = +d.dataset.ridx;
      renderHome();
    }));

    // Goto product
    app.querySelectorAll('[data-goto]').forEach(el => el.addEventListener('click', e => {
      if (e.target.closest('[data-qa]')) return;
      location.hash = '#/product/' + el.dataset.goto;
    }));

    // Filter pills
    app.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      renderHome();
    }));

    // Shop card click
    app.querySelectorAll('.shop-card').forEach(card => card.addEventListener('click', e => {
      if (e.target.closest('[data-qa]')) return;
      location.hash = '#/product/' + card.dataset.pid;
    }));

    // Quick add
    app.querySelectorAll('[data-qa]').forEach(btn => btn.addEventListener('click', e => {
      e.stopPropagation();
      const p = PRODUCTS.find(x => x.id === +btn.dataset.qa);
      if (!p) return;
      addToCart(p.id, p.colors[0].name, p.sizes.find(s => !p.disabledSizes.includes(s)) || p.sizes[0]);
      btn.textContent = '✓';
      btn.style.cssText = 'background:var(--black);color:var(--white);opacity:1;transform:translateY(0)';
      setTimeout(() => { btn.textContent = '+'; btn.style.cssText = ''; }, 900);
    }));

    // Home cart button
    document.getElementById('homeCartBtn')?.addEventListener('click', openCart);

    // Fade in grid cards
    setTimeout(() => {
      app.querySelectorAll('.shop-card').forEach((el, i) => {
        el.classList.add('fade-in');
        setTimeout(() => el.classList.add('is-visible'), i * 40);
      });
    }, 50);
  }

  /* ==================================================
     SHOP (products only, no hero)
     ================================================== */
  function renderShop() {
    const filtered = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);

    app.innerHTML = `
      <section class="shop-section shop-section--full">
        <div class="shop-header">
          <div class="shop-header__left">
            <a href="#/" class="shop-header__back">←</a>
            <span class="shop-header__title">Shop</span>
            <div class="shop-filters">
              ${['all','Clothing','Shoes','Bags'].map(f => `<a href="#/shop${f === 'all' ? '' : '/' + f}" class="filter-pill ${activeFilter === f ? 'is-active' : ''}">${f === 'all' ? 'All' : f}</a>`).join('')}
            </div>
          </div>
          <span class="shop-header__count">${filtered.length} pieces</span>
        </div>
        <div class="shop-grid">
          ${filtered.map(p => `
            <article class="shop-card" data-pid="${p.id}">
              <div class="shop-card__image">
                ${num(p.id)}
                <button class="shop-card__add" data-qa="${p.id}" aria-label="Quick add">+</button>
              </div>
              <div class="shop-card__meta">
                <span class="shop-card__name">${p.name}</span>
                <span class="shop-card__price">€${p.price}</span>
              </div>
              <div class="shop-card__colors">
                ${p.colors.map(c => `<span class="swatch" style="background:${c.hex};border-color:${swatchBorder(c.hex)}" title="${c.name}"></span>`).join('')}
              </div>
            </article>
          `).join('')}
        </div>
        <div style="max-width:1400px;margin:0 auto;padding:32px 36px 0;display:flex;justify-content:flex-end">
          <button class="pill pill--outline" id="shopCartBtn">
            <span class="dot" style="background:var(--black)"></span>
            Cart (<span class="js-cart-count">${cartCount()}</span>)
          </button>
        </div>
      </section>

      <footer class="site-footer">
        <span>&copy; 2026 LUXESSIVE</span>
        <div class="site-footer__links">
          <a href="#">Instagram</a>
          <a href="#">About</a>
          <a href="#">Shipping</a>
          <a href="#">Privacy</a>
        </div>
      </footer>
    `;

    // Shop card click
    app.querySelectorAll('.shop-card').forEach(card => card.addEventListener('click', e => {
      if (e.target.closest('[data-qa]')) return;
      location.hash = '#/product/' + card.dataset.pid;
    }));

    // Quick add
    app.querySelectorAll('[data-qa]').forEach(btn => btn.addEventListener('click', e => {
      e.stopPropagation();
      const p = PRODUCTS.find(x => x.id === +btn.dataset.qa);
      if (!p) return;
      addToCart(p.id, p.colors[0].name, p.sizes.find(s => !p.disabledSizes.includes(s)) || p.sizes[0]);
      btn.textContent = '✓';
      btn.style.cssText = 'background:var(--black);color:var(--white);opacity:1;transform:translateY(0)';
      setTimeout(() => { btn.textContent = '+'; btn.style.cssText = ''; }, 900);
    }));

    // Cart button
    document.getElementById('shopCartBtn')?.addEventListener('click', openCart);

    // Fade in
    setTimeout(() => {
      app.querySelectorAll('.shop-card').forEach((el, i) => {
        el.classList.add('fade-in');
        setTimeout(() => el.classList.add('is-visible'), i * 40);
      });
    }, 50);
  }

  /* ==================================================
     PRODUCT DETAIL
     ================================================== */
  function renderPDP(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) { location.hash = '#/'; return; }

    let selColor = p.colors[0].name, selSize = '', qty = 1, sizeErr = '', addedMsg = '';

    function render() {
      app.innerHTML = `
        <div class="pdp">
          <div class="pdp__gallery">
            <div class="pdp__image-main">${num(p.id)}</div>
            <div class="pdp__thumbs">
              ${[1,2,3,4].map((n,i) => `<div class="pdp__thumb ${!i ? 'is-active' : ''}" data-t="${i}">${num(p.id)}.${n}</div>`).join('')}
            </div>
          </div>
          <div class="pdp__info">
            <a href="#/" class="pdp__back">← Back</a>
            <p class="pdp__category">${p.category}</p>
            <h1 class="pdp__name">${p.name}</h1>
            <p class="pdp__price">€${p.price}</p>

            <p class="pdp__section-label">Color</p>
            <div class="pdp__colors">
              ${p.colors.map(c => `<button class="pdp__color-swatch ${c.name === selColor ? 'is-active' : ''}" data-col="${c.name}"><span class="pdp__color-inner" style="background:${c.hex};${c.hex === '#ffffff' || c.hex === '#f0ebe0' ? 'border:1px solid #d4d2cc' : ''}"></span></button>`).join('')}
            </div>
            <p class="pdp__color-name">${selColor}</p>

            <p class="pdp__section-label">Size</p>
            <div class="pdp__sizes">
              ${p.sizes.map(s => { const dis = p.disabledSizes.includes(s); return `<button class="pdp__size ${s === selSize ? 'is-active' : ''} ${dis ? 'is-disabled' : ''}" data-sz="${s}" ${dis ? 'disabled' : ''}>${s}</button>`; }).join('')}
            </div>
            <p class="pdp__size-error">${sizeErr}</p>

            <div class="pdp__add-row">
              <div class="qty-control"><button id="qm">−</button><span class="qty-control__value">${qty}</span><button id="qp">+</button></div>
              <button class="pill pill--dark pdp__add-btn" id="addBtn">Add to Cart — €${p.price * qty}</button>
            </div>
            <p class="pdp__added-msg">${addedMsg}</p>

            <div class="pdp__accordion">
              <div class="pdp__accordion-item is-expanded">
                <button class="pdp__accordion-toggle"><span>Description</span><span class="plus-icon"></span></button>
                <div class="pdp__accordion-body"><div class="pdp__accordion-content">${p.description}</div></div>
              </div>
              <div class="pdp__accordion-item">
                <button class="pdp__accordion-toggle"><span>Details</span><span class="plus-icon"></span></button>
                <div class="pdp__accordion-body"><div class="pdp__accordion-content"><ul>${p.details.map(d => `<li>${d}</li>`).join('')}</ul></div></div>
              </div>
              <div class="pdp__accordion-item">
                <button class="pdp__accordion-toggle"><span>Care</span><span class="plus-icon"></span></button>
                <div class="pdp__accordion-body"><div class="pdp__accordion-content"><ul>${p.care.map(c => `<li>${c}</li>`).join('')}</ul></div></div>
              </div>
            </div>

            <div style="margin-top:24px">
              <button class="pill pill--outline" id="pdpCartBtn"><span class="dot" style="background:var(--black)"></span> Cart (<span class="js-cart-count">${cartCount()}</span>)</button>
            </div>
          </div>
        </div>`;

      // Events
      app.querySelectorAll('[data-col]').forEach(b => b.addEventListener('click', () => { selColor = b.dataset.col; addedMsg = ''; render(); }));
      app.querySelectorAll('.pdp__size:not(.is-disabled)').forEach(b => b.addEventListener('click', () => { selSize = b.dataset.sz; sizeErr = ''; addedMsg = ''; render(); }));
      document.getElementById('qm')?.addEventListener('click', () => { if (qty > 1) { qty--; addedMsg = ''; render(); } });
      document.getElementById('qp')?.addEventListener('click', () => { if (qty < 10) { qty++; addedMsg = ''; render(); } });
      document.getElementById('addBtn')?.addEventListener('click', () => {
        if (!selSize) { sizeErr = 'Please select a size'; addedMsg = ''; render(); return; }
        addToCart(p.id, selColor, selSize, qty);
        addedMsg = `Added to cart`; sizeErr = ''; render();
      });
      app.querySelectorAll('.pdp__thumb').forEach(t => t.addEventListener('click', () => { app.querySelectorAll('.pdp__thumb').forEach(x => x.classList.remove('is-active')); t.classList.add('is-active'); }));
      app.querySelectorAll('.pdp__accordion-toggle').forEach(b => b.addEventListener('click', () => b.closest('.pdp__accordion-item').classList.toggle('is-expanded')));
      document.getElementById('pdpCartBtn')?.addEventListener('click', openCart);
    }
    render();
  }

  /* ==================================================
     CHECKOUT
     ================================================== */
  function renderCheckout() {
    if (!cart.length) { location.hash = '#/'; return; }
    const sub = cartTotal(), ship = sub >= FREE_SHIP ? 0 : SHIPPING, total = sub + ship;

    app.innerHTML = `<div class="checkout">
      <a href="#/" class="checkout__back">← Continue Shopping</a>
      <h1 class="checkout__title">Checkout</h1>
      <div class="checkout__grid">
        <div>
          <div class="form-section"><h3 class="form-section__title">Contact</h3><div class="form-row"><div class="form-field"><label>Email</label><input type="email" id="email" placeholder="your@email.com"></div></div></div>
          <div class="form-section"><h3 class="form-section__title">Shipping</h3>
            <div class="form-row form-row--2"><div class="form-field"><label>First Name</label><input id="fn" placeholder="John"></div><div class="form-field"><label>Last Name</label><input id="ln" placeholder="Doe"></div></div>
            <div class="form-row"><div class="form-field"><label>Address</label><input id="addr" placeholder="Street address"></div></div>
            <div class="form-row form-row--3"><div class="form-field"><label>City</label><input id="city" placeholder="Berlin"></div><div class="form-field"><label>Postal</label><input id="zip" placeholder="10115"></div><div class="form-field"><label>Country</label><select id="country"><option>Germany</option><option>Austria</option><option>Switzerland</option><option>France</option><option>Italy</option><option>Netherlands</option><option>Spain</option><option>UK</option></select></div></div>
          </div>
          <div class="form-section"><h3 class="form-section__title">Payment</h3>
            <div class="form-row"><div class="form-field"><label>Card Number</label><input id="card" placeholder="1234 5678 9012 3456" maxlength="19"></div></div>
            <div class="form-row form-row--2"><div class="form-field"><label>Expiry</label><input id="exp" placeholder="MM / YY" maxlength="7"></div><div class="form-field"><label>CVC</label><input id="cvc" placeholder="123" maxlength="4"></div></div>
          </div>
          <button class="pill pill--dark pill--full" id="placeBtn">Place Order — €${total}</button>
        </div>
        <div class="checkout-summary">
          <h3 class="checkout-summary__title">Summary</h3>
          ${cart.map(it => { const p = PRODUCTS.find(x => x.id === it.productId); return p ? `<div class="checkout-summary__item"><div class="checkout-summary__thumb">${num(p.id)}</div><div><div class="checkout-summary__item-name">${p.name}</div><div class="checkout-summary__item-variant">${it.color} / ${it.size}</div><div class="checkout-summary__item-qty">Qty: ${it.qty}</div></div><div class="checkout-summary__item-price">€${p.price * it.qty}</div></div>` : ''; }).join('')}
          <div class="checkout-summary__totals"><div class="checkout-summary__row"><span>Subtotal</span><span>€${sub}</span></div><div class="checkout-summary__row"><span>Shipping</span><span>${ship ? '€' + ship : 'Free'}</span></div><div class="checkout-summary__row checkout-summary__row--total"><span>Total</span><span>€${total}</span></div></div>
        </div>
      </div>
    </div>`;

    document.getElementById('card')?.addEventListener('input', e => { let v = e.target.value.replace(/\D/g,'').substring(0,16); e.target.value = v.replace(/(.{4})/g,'$1 ').trim(); });
    document.getElementById('exp')?.addEventListener('input', e => { let v = e.target.value.replace(/\D/g,'').substring(0,4); if (v.length >= 2) v = v.substring(0,2)+' / '+v.substring(2); e.target.value = v; });

    document.getElementById('placeBtn')?.addEventListener('click', async () => {
      const fields = ['email','fn','ln','addr','city','zip','card','exp','cvc'];
      let ok = true;
      fields.forEach(id => { const el = document.getElementById(id); if (!el?.value.trim()) { el?.classList.add('is-error'); ok = false; } else el?.classList.remove('is-error'); });
      if (!ok) return;

      const orderPayload = {
        customer: {
          email: document.getElementById('email').value,
          firstName: document.getElementById('fn').value,
          lastName: document.getElementById('ln').value,
          address: document.getElementById('addr').value,
          city: document.getElementById('city').value,
          postal: document.getElementById('zip').value,
          country: document.getElementById('country').value
        },
        items: cart.map(it => {
          const p = PRODUCTS.find(x => x.id === it.productId);
          return { productId: it.productId, productName: p ? p.name : 'Unknown', color: it.color, size: it.size, qty: it.qty, price: p ? p.price : 0 };
        }),
        subtotal: sub,
        shipping: ship,
        total
      };

      try {
        const resp = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderPayload) });
        const result = await resp.json();
        sessionStorage.setItem('luxessive_order', JSON.stringify({ number: result.order.id, email: orderPayload.customer.email, total, items: cartCount(), shipping: ship }));
      } catch {
        sessionStorage.setItem('luxessive_order', JSON.stringify({ number: 'LX-' + Math.random().toString(36).substring(2,8).toUpperCase(), email: orderPayload.customer.email, total, items: cartCount(), shipping: ship }));
      }
      clearCart(); location.hash = '#/success';
    });
  }

  /* ==================================================
     SUCCESS
     ================================================== */
  function renderSuccess() {
    const o = JSON.parse(sessionStorage.getItem('luxessive_order') || '{}');
    app.innerHTML = `<div class="success"><div class="success__inner">
      <div class="success__check"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 16 14 22 24 10"/></svg></div>
      <h1 class="success__title">Thank You</h1>
      <p class="success__order-number">Order ${o.number || ''}</p>
      <p class="success__text">Your order is confirmed. Shipping in 2–4 business days.<br>Confirmation sent to <strong>${o.email || ''}</strong>.</p>
      <div class="success__details">
        <div class="success__details-row"><span class="success__details-label">Order</span><span class="success__details-value">${o.number || ''}</span></div>
        <div class="success__details-row"><span class="success__details-label">Items</span><span class="success__details-value">${o.items || 0}</span></div>
        <div class="success__details-row"><span class="success__details-label">Shipping</span><span class="success__details-value">${o.shipping === 0 ? 'Free' : '€' + (o.shipping || SHIPPING)}</span></div>
        <div class="success__details-row"><span class="success__details-label">Total</span><span class="success__details-value">€${o.total || 0}</span></div>
      </div>
      <a href="#/" class="pill pill--dark">Continue Shopping</a>
    </div></div>`;
    sessionStorage.removeItem('luxessive_order');
  }

  /* ---- Init ---- */
  async function init() {
    try {
      const resp = await fetch('/api/products');
      const data = await resp.json();
      PRODUCTS = data.products || [];
    } catch {
      PRODUCTS = [];
    }
    buildShowcase();
    updateCartCount();
    navigate();
  }
  init();
})();
