// TestComponents.jsx

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { BarChart } from '@mui/x-charts/BarChart';

const Test = () => {
  const [data, setData] = useState({bot:'', av_profit: 0,av_diff: 0, best_trade: 0,best_trade_diff: 0, worst_trade: 0, worst_trade_diff: 0});

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get/winner-bot'); // Hacer una solicitud a la API REST en el servidor backend
      const dataFromDB = await response.json();
      console.log(dataFromDB);
      setData(dataFromDB[0]);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  return (
    <div>
      <h1>Datos desde PostgreSQL</h1>
      <Button variant="contained" onClick={fetchData}>Botón de MUI</Button>
      <BarChart
        xAxis={[
          {
            id: 'Date',
            data: formattedDataset.map(entry => entry.date),
            scaleType: 'time',
          },
        ]}
        series={[
          {
            id: 'Profit',
            label: 'Profit',
            data: formattedDataset.map(entry => ({
              x: entry.date,
              y: entry.profit,
              color: entry.profit >= 0 ? 'green' : 'red', // Color verde si el profit es positivo, rojo si es negativo
            })),
          },
        ]}
        height={200}
      />
    </div>
    
  );
};

export default Test;
