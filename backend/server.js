// backend/server.js

const express = require('express');
const { fetchDataFromDB,fetchBalanceFromDB,fetchWinnerBot,fetchLooserBot } = require('./dbService'); // Importa fetchDataFromDB desde dbService

const app = express();
const port = 5000;

// Middleware para habilitar CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Cambia esto por el origen de tu aplicación frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/api/get/trades', async (req, res) => {
  try {
    const data = await fetchDataFromDB(); // Llama a fetchDataFromDB para obtener los datos
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

app.get('/api/get/balance', async (req, res) => {
  try {
    const data = await fetchBalanceFromDB(); // Llama a fetchDataFromDB para obtener los datos
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

app.get('/api/get/active-bots', async (req, res) => {
  try {
    const data = await fetchBalanceFromDB(); // Llama a fetchDataFromDB para obtener los datos
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

app.get('/api/get/winner-bot', async (req, res) => {
  try {
    const data = await fetchWinnerBot(); // Llama a fetchDataFromDB para obtener los datos
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

app.get('/api/get/looser-bot', async (req, res) => {
  try {
    const data = await fetchLooserBot(); // Llama a fetchDataFromDB para obtener los datos
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});



app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
