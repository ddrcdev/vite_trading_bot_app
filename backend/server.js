// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const { fetchDataFromDB,fetchBalanceFromDB,fetchWinnerBot,fetchLooserBot, fetchBackAnalysis, fetchTokenDataAvailable } = require('./dbService'); // Importa fetchDataFromDB desde dbService

const app = express();
// Middleware para permitir solicitudes de origen cruzado desde cualquier origen
app.use(cors());


app.use(bodyParser.json({ limit: 'Infinity'}));
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

app.get('/api/get/token_data', async (req, res) => {
  try {
    const data = await fetchTokenDataAvailable(); // Llama a fetchDataFromDB para obtener los datos
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});



// Ruta para manejar la solicitud POST al script de Python
app.post('/api/post/strategy-backanalysis', async (req, res) => {
  try {
    const data = await fetchBackAnalysis(req.body.data); // Llama a fetchDataFromDB para obtener los datos
    res.json(data);
  } catch (error) {
    console.error('Error al ejecutar el script de Python:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
