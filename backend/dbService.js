// backend/dbService.js

const { Client } = require('pg');

// Función para obtener datos de la base de datos
async function fetchDataFromDB() {
  const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5433, // Cambia este puerto si es diferente en tu configuración
    password: "1234",
    database: "TradesData"
  });

  try {
    await client.connect()  
    const result = await client.query(`SELECT * FROM trades`);
    await client.end();
    return result.rows;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  } finally {
    await client.end();
  }
}
// Función para obtener datos de la base de datos
async function fetchBalanceFromDB() {
  const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5433, // Cambia este puerto si es diferente en tu configuración
    password: "1234",
    database: "TradesData"
  });

  try {
    await client.connect()  
    const result = await client.query(`SELECT * FROM balance`);
    await client.end();
    return result.rows;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = { fetchDataFromDB, fetchBalanceFromDB };
