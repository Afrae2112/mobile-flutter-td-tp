const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const loadData = () => {
  const data = fs.readFileSync('data.json', 'utf8');
  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

app.get('/', (req, res) => {
  res.send('API Backend fonctionne!');
});

app.get('/products', (req, res) => {
  const data = loadData();
  res.json(data.products);
});

app.post('/products', (req, res) => {
  const data = loadData();
  const { name, price, stock, categorie } = req.body;

  if (!name || !price || !stock || !categorie) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const newProduct = { name, price, stock, categorie };
  data.products.push(newProduct);
  saveData(data);
  res.status(201).send('Produit ajouté');
});

app.get('/orders', (req, res) => {
  const data = loadData();
  res.json(data.orders);
});

app.post('/orders', (req, res) => {
  const data = loadData();
  const newOrder = req.body;

  if (!newOrder.product || !newOrder.quantity) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  data.orders.push(newOrder);
  saveData(data);
  res.status(201).send('Commande créée');
});

app.listen(port, () => {
  console.log(`Serveur API démarré sur http://localhost:${port}`);
});