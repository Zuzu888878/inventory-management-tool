const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  res.send('Hallo Welt!');
});

app.get('/api/assets', (req, res) => {
  const data = readData();
  res.json(data.assets);
});

app.get('/api/assets/:id', (req, res) => {
  const data = readData();
  const asset = data.assets.find((item) => item.id === Number(req.params.id));

  if (!asset) {
    return res.status(404).json({ message: 'Asset not found' });
  }

  res.json(asset);
});

app.post('/api/assets', (req, res) => {
  const data = readData();
  const id = data.assets.length ? Math.max(...data.assets.map((asset) => asset.id)) + 1 : 1;
  const asset = { ...req.body, id };

  data.assets.push(asset);
  writeData(data);

  res.status(201).json(asset);
});

app.put('/api/assets/:id', (req, res) => {
  const data = readData();
  const id = Number(req.params.id);
  const index = data.assets.findIndex((asset) => asset.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Asset not found' });
  }

  data.assets[index] = { ...req.body, id };
  writeData(data);

  res.json(data.assets[index]);
});

app.delete('/api/assets/:id', (req, res) => {
  const data = readData();
  const id = Number(req.params.id);
  const index = data.assets.findIndex((asset) => asset.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Asset not found' });
  }

  data.assets.splice(index, 1);
  writeData(data);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
