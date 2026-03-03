/* ===================================================
   LUXESSIVE Admin — CRM Panel Logic
   =================================================== */
(() => {
  'use strict';

  const API = '';
  let products = [];
  let orders = [];
  let activeTab = 'products';

  // DOM
  const content = document.getElementById('content');
  const pageTitle = document.getElementById('pageTitle');
  const topActions = document.getElementById('topActions');
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');

  // Modals
  const overlay = document.getElementById('modalOverlay');
  const productModal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const bulkModal = document.getElementById('bulkModal');
  const bulkClose = document.getElementById('bulkClose');
  const bulkJson = document.getElementById('bulkJson');
  const bulkError = document.getElementById('bulkError');
  const bulkImportBtn = document.getElementById('bulkImportBtn');

  // ---- API helpers ----
  async function api(path, opts = {}) {
    const res = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    return res.json();
  }

  async function loadProducts() {
    const data = await api('/api/products');
    products = data.products || [];
  }

  async function loadOrders() {
    const data = await api('/api/orders');
    orders = data.orders || [];
  }

  // ---- Sidebar nav ----
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      sidebar.classList.remove('is-open');
      render();
    });
  });

  menuBtn.addEventListener('click', () => sidebar.classList.toggle('is-open'));

  // ---- Modal helpers ----
  function openModal(modal) {
    overlay.classList.add('is-visible');
    modal.classList.add('is-open');
  }

  function closeModal(modal) {
    overlay.classList.remove('is-visible');
    modal.classList.remove('is-open');
  }

  modalClose.addEventListener('click', () => closeModal(productModal));
  bulkClose.addEventListener('click', () => closeModal(bulkModal));
  overlay.addEventListener('click', () => {
    closeModal(productModal);
    closeModal(bulkModal);
  });

  // ---- Render router ----
  function render() {
    if (activeTab === 'products') renderProducts();
    else renderOrders();
  }

  // =============================================
  //  PRODUCTS TAB
  // =============================================
  function renderProducts() {
    pageTitle.textContent = 'Products';
    topActions.innerHTML = `
      <button class="btn" id="btnBulk">Bulk Import</button>
      <button class="btn btn--primary" id="btnAdd">+ Add Product</button>
    `;

    const cats = [...new Set(products.map(p => p.category))];

    // Stats
    const totalValue = products.reduce((s, p) => s + p.price, 0);

    content.innerHTML = `
      <div class="stats-row">
        <div class="stat-card"><div class="stat-card__label">Total Products</div><div class="stat-card__value">${products.length}</div></div>
        <div class="stat-card"><div class="stat-card__label">Categories</div><div class="stat-card__value">${cats.length}</div></div>
        <div class="stat-card"><div class="stat-card__label">Avg Price</div><div class="stat-card__value">&euro;${products.length ? Math.round(totalValue / products.length) : 0}</div></div>
      </div>
      <div class="card">
        <div class="card__header">
          <span class="card__title">All Products</span>
          <span class="card__count">${products.length} items</span>
        </div>
        ${products.length ? `<table>
          <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Colors</th><th>Sizes</th><th>Actions</th></tr></thead>
          <tbody>
            ${products.map(p => `<tr>
              <td>${p.id}</td>
              <td><strong>${esc(p.name)}</strong></td>
              <td>&euro;${p.price}</td>
              <td>${esc(p.category)}</td>
              <td><div class="color-dots">${(p.colors || []).map(c => `<span class="color-dot" style="background:${c.hex}" title="${esc(c.name)}"></span>`).join('')}</div></td>
              <td>${(p.sizes || []).join(', ')}</td>
              <td><div class="table-actions">
                <button class="btn btn--sm" data-edit="${p.id}">Edit</button>
                <button class="btn btn--sm btn--danger" data-del="${p.id}">Delete</button>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>` : `<div class="empty-state"><div class="empty-state__icon">&#9634;</div><div class="empty-state__title">No products yet</div><div class="empty-state__text">Add your first product to get started.</div></div>`}
      </div>
    `;

    // Bind buttons
    document.getElementById('btnAdd').addEventListener('click', () => openProductModal());
    document.getElementById('btnBulk').addEventListener('click', () => {
      bulkJson.value = '';
      bulkError.textContent = '';
      openModal(bulkModal);
    });

    content.querySelectorAll('[data-edit]').forEach(btn =>
      btn.addEventListener('click', () => {
        const p = products.find(x => x.id === +btn.dataset.edit);
        if (p) openProductModal(p);
      })
    );

    content.querySelectorAll('[data-del]').forEach(btn =>
      btn.addEventListener('click', async () => {
        const p = products.find(x => x.id === +btn.dataset.del);
        if (!p || !confirm(`Delete "${p.name}"?`)) return;
        await api(`/api/products/${p.id}`, { method: 'DELETE' });
        await loadProducts();
        renderProducts();
      })
    );
  }

  // ---- Product modal form ----
  function openProductModal(existing) {
    const p = existing || {};
    modalTitle.textContent = existing ? 'Edit Product' : 'Add Product';

    modalBody.innerHTML = `
      <form class="form-grid" id="productForm">
        <div class="field field--full">
          <label>Name</label>
          <input id="pName" value="${esc(p.name || '')}" placeholder="Product name" required>
        </div>
        <div class="field">
          <label>Price (&euro;)</label>
          <input type="number" id="pPrice" value="${p.price || ''}" placeholder="0" step="0.01" required>
        </div>
        <div class="field">
          <label>Category</label>
          <select id="pCategory">
            ${['Clothing','Shoes','Bags'].map(c => `<option ${p.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="field field--full">
          <label>Description</label>
          <textarea id="pDesc" rows="2" placeholder="Short description">${esc(p.description || '')}</textarea>
        </div>
        <hr class="form-sep">
        <div class="field field--full">
          <label>Colors (JSON array: [{"name":"Black","hex":"#111111"}])</label>
          <textarea id="pColors" rows="2">${p.colors ? JSON.stringify(p.colors) : '[{"name":"Black","hex":"#111111"}]'}</textarea>
        </div>
        <div class="field">
          <label>Sizes (comma-separated)</label>
          <input id="pSizes" value="${(p.sizes || []).join(', ')}" placeholder="S, M, L, XL">
        </div>
        <div class="field">
          <label>Disabled Sizes</label>
          <input id="pDisabled" value="${(p.disabledSizes || []).join(', ')}" placeholder="XS, XXL">
        </div>
        <hr class="form-sep">
        <div class="field field--full">
          <label>Details (one per line)</label>
          <textarea id="pDetails" rows="3">${(p.details || []).join('\n')}</textarea>
        </div>
        <div class="field field--full">
          <label>Care (one per line)</label>
          <textarea id="pCare" rows="3">${(p.care || []).join('\n')}</textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn" id="formCancel">Cancel</button>
          <button type="submit" class="btn btn--primary">${existing ? 'Save Changes' : 'Add Product'}</button>
        </div>
      </form>
    `;

    openModal(productModal);

    document.getElementById('formCancel').addEventListener('click', () => closeModal(productModal));

    document.getElementById('productForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      let colors;
      try { colors = JSON.parse(document.getElementById('pColors').value); }
      catch { colors = [{ name: 'Black', hex: '#111111' }]; }

      const body = {
        name: document.getElementById('pName').value.trim(),
        price: parseFloat(document.getElementById('pPrice').value),
        category: document.getElementById('pCategory').value,
        description: document.getElementById('pDesc').value.trim(),
        colors,
        sizes: document.getElementById('pSizes').value.split(',').map(s => s.trim()).filter(Boolean),
        disabledSizes: document.getElementById('pDisabled').value.split(',').map(s => s.trim()).filter(Boolean),
        details: document.getElementById('pDetails').value.split('\n').map(s => s.trim()).filter(Boolean),
        care: document.getElementById('pCare').value.split('\n').map(s => s.trim()).filter(Boolean)
      };

      if (!body.name || !body.price) return;

      if (existing) {
        await api(`/api/products/${existing.id}`, { method: 'PUT', body });
      } else {
        await api('/api/products', { method: 'POST', body });
      }

      closeModal(productModal);
      await loadProducts();
      renderProducts();
    });
  }

  // ---- Bulk import ----
  bulkImportBtn.addEventListener('click', async () => {
    bulkError.textContent = '';
    let items;
    try {
      items = JSON.parse(bulkJson.value);
      if (!Array.isArray(items)) throw new Error('Must be an array');
    } catch (e) {
      bulkError.textContent = 'Invalid JSON: ' + e.message;
      return;
    }

    const result = await api('/api/products/bulk', { method: 'POST', body: { products: items } });
    closeModal(bulkModal);
    await loadProducts();
    renderProducts();
    alert(`Imported ${result.count} product(s) successfully.`);
  });

  // =============================================
  //  ORDERS TAB
  // =============================================
  let expandedOrder = null;

  function renderOrders() {
    pageTitle.textContent = 'Orders';
    topActions.innerHTML = `<button class="btn" id="btnRefresh">Refresh</button>`;

    const pending = orders.filter(o => o.status === 'pending').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    content.innerHTML = `
      <div class="stats-row">
        <div class="stat-card"><div class="stat-card__label">Total Orders</div><div class="stat-card__value">${orders.length}</div></div>
        <div class="stat-card"><div class="stat-card__label">Pending</div><div class="stat-card__value">${pending}</div></div>
        <div class="stat-card"><div class="stat-card__label">Shipped</div><div class="stat-card__value">${shipped}</div></div>
        <div class="stat-card"><div class="stat-card__label">Delivered</div><div class="stat-card__value">${delivered}</div></div>
      </div>
      <div class="card">
        <div class="card__header">
          <span class="card__title">All Orders</span>
          <span class="card__count">${orders.length} orders</span>
        </div>
        ${orders.length ? `<table>
          <thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody id="ordersBody">
            ${orders.map(o => orderRow(o)).join('')}
          </tbody>
        </table>` : `<div class="empty-state"><div class="empty-state__icon">&#9776;</div><div class="empty-state__title">No orders yet</div><div class="empty-state__text">Orders will appear here when customers check out.</div></div>`}
      </div>
    `;

    document.getElementById('btnRefresh').addEventListener('click', async () => {
      await loadOrders();
      renderOrders();
    });

    bindOrderEvents();
  }

  function orderRow(o) {
    const custName = o.customer ? `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim() : 'N/A';
    const itemCount = (o.items || []).reduce((s, i) => s + (i.qty || 1), 0);
    const dateStr = o.date ? new Date(o.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    let html = `<tr class="order-row" data-oid="${o.id}">
      <td><strong>${esc(o.id)}</strong></td>
      <td>${dateStr}</td>
      <td>${esc(custName)}<br><span style="font-size:11px;color:var(--grey)">${esc(o.customer?.email || '')}</span></td>
      <td>${itemCount} item${itemCount !== 1 ? 's' : ''}</td>
      <td><strong>&euro;${o.total || 0}</strong></td>
      <td>
        <select class="status-select" data-status="${o.id}">
          ${['pending','shipped','delivered'].map(s => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
      <td><button class="btn btn--sm" data-expand="${o.id}">${expandedOrder === o.id ? '▲' : '▼'}</button></td>
    </tr>`;

    if (expandedOrder === o.id) {
      html += `<tr><td colspan="7" style="padding:0">
        <div class="order-detail">
          <div class="order-detail__grid">
            <div>
              <div class="order-detail__section-title">Customer</div>
              <div class="order-detail__row"><span>Name</span><span>${esc(custName)}</span></div>
              <div class="order-detail__row"><span>Email</span><span>${esc(o.customer?.email || '')}</span></div>
              <div class="order-detail__row"><span>Address</span><span>${esc(o.customer?.address || '')}</span></div>
              <div class="order-detail__row"><span>City</span><span>${esc(o.customer?.city || '')}</span></div>
              <div class="order-detail__row"><span>Postal</span><span>${esc(o.customer?.postal || '')}</span></div>
              <div class="order-detail__row"><span>Country</span><span>${esc(o.customer?.country || '')}</span></div>
            </div>
            <div>
              <div class="order-detail__section-title">Summary</div>
              <div class="order-detail__row"><span>Subtotal</span><span>&euro;${o.subtotal || 0}</span></div>
              <div class="order-detail__row"><span>Shipping</span><span>${o.shipping === 0 ? 'Free' : '&euro;' + (o.shipping || 0)}</span></div>
              <div class="order-detail__row" style="font-weight:600"><span>Total</span><span>&euro;${o.total || 0}</span></div>
            </div>
          </div>
          ${(o.items || []).length ? `
          <table class="order-items-table" style="margin-top:16px">
            <thead><tr><th>Product</th><th>Color</th><th>Size</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>
              ${o.items.map(it => `<tr>
                <td>${esc(it.productName || 'Product #' + it.productId)}</td>
                <td>${esc(it.color || '')}</td>
                <td>${it.size || ''}</td>
                <td>${it.qty || 1}</td>
                <td>&euro;${(it.price || 0) * (it.qty || 1)}</td>
              </tr>`).join('')}
            </tbody>
          </table>` : ''}
        </div>
      </td></tr>`;
    }

    return html;
  }

  function bindOrderEvents() {
    content.querySelectorAll('[data-expand]').forEach(btn => {
      btn.addEventListener('click', () => {
        expandedOrder = expandedOrder === btn.dataset.expand ? null : btn.dataset.expand;
        renderOrders();
      });
    });

    content.querySelectorAll('[data-status]').forEach(sel => {
      sel.addEventListener('change', async () => {
        await api(`/api/orders/${sel.dataset.status}/status`, {
          method: 'PATCH',
          body: { status: sel.value }
        });
        await loadOrders();
        renderOrders();
      });
    });
  }

  // ---- Utility ----
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  // ---- Init ----
  async function init() {
    await Promise.all([loadProducts(), loadOrders()]);
    render();
  }
  init();
})();
