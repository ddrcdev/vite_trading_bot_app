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
    const result = await client.query(`
      SELECT balance.*, trades.bot 
      FROM balance 
      INNER JOIN trades ON trades.trade_id = balance.trade_id
    `);
    await client.end();
    return result.rows;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function fetchWinnerBot() {
  const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5433, // Cambia este puerto si es diferente en tu configuración
    password: "1234",
    database: "TradesData"
  });

  const winner_query = `
  WITH best_bot AS (
    SELECT bot, 
           AVG(profit) AS av_profit,
           AVG(diff_percentage) AS av_diff,
           MAX(profit) AS best_trade,
           MAX(diff_percentage) AS best_trade_diff,
           MIN(profit) AS worst_trade,
           MIN(diff_percentage) AS worst_trade_diff
    FROM trades
    WHERE status = 'Closed'
    GROUP BY bot
    ORDER BY AVG(profit) DESC
    LIMIT 1
)
SELECT bot, av_profit, av_diff, best_trade, best_trade_diff, worst_trade, worst_trade_diff
FROM best_bot;
`;

  try {
    await client.connect()
    const winnerBot = await client.query(winner_query);
    return winnerBot.rows  

  }  catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  } finally {
    await client.end();
  }


}

async function fetchLooserBot() {
  const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5433, // Cambia este puerto si es diferente en tu configuración
    password: "1234",
    database: "TradesData"
  });

  const looser_query = `
    WITH worst_bot AS (
      SELECT bot, 
             AVG(profit) AS av_profit,
             AVG(diff_percentage) AS av_diff,
             MAX(profit) AS best_trade,
             MAX(diff_percentage) AS best_trade_diff,
             MIN(profit) AS worst_trade,
             MIN(diff_percentage) AS worst_trade_diff
      FROM trades
      WHERE status = 'Closed'
      GROUP BY bot
      ORDER BY AVG(profit) ASC
      LIMIT 1
  )
  SELECT bot, av_profit,av_diff, best_trade,best_trade_diff, worst_trade, worst_trade_diff
  FROM worst_bot;
  `;
  try {
    await client.connect()
    const looserBot = await client.query(looser_query);
    return looserBot.rows  

  }  catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  } finally {
    await client.end();
  }


}

module.exports = { fetchDataFromDB, fetchBalanceFromDB, fetchWinnerBot,fetchLooserBot };
