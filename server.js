const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json({ limit: '5mb' }));
app.use(express.static(__dirname));

// --- Helpers ---
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function nextProductId(products) {
  return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

// --- PRODUCTS ---

// List all products
app.get('/api/products', (req, res) => {
  try {
    const data = readData();
    res.json({ products: data.products });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const data = readData();
    const product = data.products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read product' });
  }
});

// Add single product
app.post('/api/products', (req, res) => {
  try {
    const data = readData();
    const body = req.body;

    if (!body.name || !body.price || !body.category) {
      return res.status(400).json({ error: 'name, price, and category are required' });
    }

    const product = {
      id: nextProductId(data.products),
      name: body.name,
      price: Number(body.price),
      category: body.category,
      colors: body.colors || [],
      sizes: body.sizes || [],
      disabledSizes: body.disabledSizes || [],
      description: body.description || '',
      details: body.details || [],
      care: body.care || []
    };

    data.products.push(product);
    writeData(data);
    res.status(201).json({ product });
  } catch (e) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Bulk import products
app.post('/api/products/bulk', (req, res) => {
  try {
    const data = readData();
    const items = req.body.products;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'products array is required' });
    }

    let nextId = nextProductId(data.products);
    const added = [];

    for (const body of items) {
      if (!body.name || !body.price || !body.category) continue;

      const product = {
        id: nextId++,
        name: body.name,
        price: Number(body.price),
        category: body.category,
        colors: body.colors || [],
        sizes: body.sizes || [],
        disabledSizes: body.disabledSizes || [],
        description: body.description || '',
        details: body.details || [],
        care: body.care || []
      };

      data.products.push(product);
      added.push(product);
    }

    writeData(data);
    res.status(201).json({ products: added, count: added.length });
  } catch (e) {
    res.status(500).json({ error: 'Failed to bulk import' });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const data = readData();
    const id = parseInt(req.params.id);
    const idx = data.products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    const body = req.body;
    const product = data.products[idx];

    if (body.name !== undefined) product.name = body.name;
    if (body.price !== undefined) product.price = Number(body.price);
    if (body.category !== undefined) product.category = body.category;
    if (body.colors !== undefined) product.colors = body.colors;
    if (body.sizes !== undefined) product.sizes = body.sizes;
    if (body.disabledSizes !== undefined) product.disabledSizes = body.disabledSizes;
    if (body.description !== undefined) product.description = body.description;
    if (body.details !== undefined) product.details = body.details;
    if (body.care !== undefined) product.care = body.care;

    data.products[idx] = product;
    writeData(data);
    res.json({ product });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const data = readData();
    const id = parseInt(req.params.id);
    const idx = data.products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    data.products.splice(idx, 1);
    writeData(data);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// --- ORDERS ---

// List all orders (newest first)
app.get('/api/orders', (req, res) => {
  try {
    const data = readData();
    const orders = (data.orders || []).slice().reverse();
    res.json({ orders });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  try {
    const data = readData();
    const order = (data.orders || []).find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read order' });
  }
});

// Create order
app.post('/api/orders', (req, res) => {
  try {
    const data = readData();
    const body = req.body;

    const order = {
      id: 'LX-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: new Date().toISOString(),
      status: 'pending',
      customer: body.customer || {},
      items: (body.items || []).map(item => ({
        productId: item.productId,
        productName: item.productName || 'Unknown',
        color: item.color,
        size: item.size,
        qty: item.qty,
        price: item.price || 0
      })),
      subtotal: body.subtotal || 0,
      shipping: body.shipping || 0,
      total: body.total || 0
    };

    if (!data.orders) data.orders = [];
    data.orders.push(order);
    writeData(data);
    res.status(201).json({ order });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const data = readData();
    const valid = ['pending', 'shipped', 'delivered'];
    const status = req.body.status;

    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Status must be: pending, shipped, or delivered' });
    }

    const order = (data.orders || []).find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    writeData(data);
    res.json({ order });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// --- START ---
app.listen(PORT, () => {
  console.log(`LUXESSIVE server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});
