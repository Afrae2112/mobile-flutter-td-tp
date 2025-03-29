const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataPath = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());

// Helper functions
function loadData() {
  try {
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
  } catch (err) {
    return { products: [], orders: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Initialiser data.json s'il n'existe pas
if (!fs.existsSync(dataPath)) {
  saveData({
    products: [
      { id: 1, name: "Ordinateur Portable", price: 5999.99, stock: 10, category: "Electronique" },
      { id: 2, name: "Smartphone", price: 2999.99, stock: 15, category: "Phone" },
      { id: 3, name: "Casque Audio", price: 499.99, stock: 20, category: "Accessoire" }
    ],
    orders: []
  });
}

// Routes Produits
app.get('/products', (req, res) => {
  const data = loadData();
  res.json(data.products);
});

app.post('/products', (req, res) => {
  const data = loadData();
  const newProduct = req.body;
  
  if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  newProduct.id = data.products.length > 0 
    ? Math.max(...data.products.map(p => p.id)) + 1 
    : 1;
  
  data.products.push(newProduct);
  saveData(data);
  res.status(201).json(newProduct);
});

// Routes Commandes
app.get('/orders', (req, res) => {
  const data = loadData();
  const ordersWithProductNames = data.orders.map(order => {
    const product = data.products.find(p => p.id === order.productId);
    return {
      ...order,
      productName: product ? product.name : 'Inconnu'
    };
  });
  res.json(ordersWithProductNames);
});

app.post('/orders', (req, res) => {
  const data = loadData();
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'productId et quantity sont requis' });
  }

  const product = data.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Stock insuffisant' });
  }

  product.stock -= quantity;
  
  const newOrder = {
    id: data.orders.length > 0 ? Math.max(...data.orders.map(o => o.id)) + 1 : 1,
    productId,
    quantity,
    total: product.price * quantity,
    date: new Date().toISOString()
  };

  data.orders.push(newOrder);
  saveData(data);
  res.status(201).json(newOrder);
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur API démarré sur http://localhost:${port}`);
});