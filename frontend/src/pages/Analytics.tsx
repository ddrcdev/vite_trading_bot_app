import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent } from '@mui/material';
import ResultCard from '../components/ResultCard';
import ResultsChart from '../components/ResultsGraph'; // Importa el componente del gráfico
import OrdersTable from '../components/OrdersTable';
import globalResultsData from '../assets/Results/global_results.json';
import '../App.css';


function Analytics() {
  const [operations, setOperations] = useState({});

  useEffect(() => {
    // Cargar los datos del archivo JSON cuando el componente se monta
    setOperations(globalResultsData.operations);
  }, []);

  const cardData = [
    {
      title: 'Balance',
      mainNumber: 1000,
      numbers: [
        { number: 200, text: '7D (%):' },
        { number: 300, text: '1M (%):' },
        { number: -400, text: 'All (%):' }
      ]
    },
    {
      title: 'Best Strategy',
      mainNumber: 'MyStrategy1',
      numbers: [
        { number: 600, text: 'Prof.Av (%):' },
        { number: 700, text: 'Prof.Total (USD):' },
        { number: 800, text: 'Total Ops' }
      ]
    },
    {
      title: 'Worst Strategy',
      mainNumber: 'MyStrategy2',
      numbers: [
        { number: -100, text: 'Prof.Av (%):' },
        { number: -200, text: 'Prof.Total (USD):' },
        { number: 300, text: 'Total Ops:' }
      ]
    }
  ];

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 600 },
    { name: 'May', value: 800 },
    { name: 'Jun', value: 700 }
  ];

  const chartSeries = [
    { type: 'line', dataKey: 'value', color: '#8884d8' },
  ];

  return (
    <><div className='card-container'>
      <Grid container spacing={1}>
        {cardData.map((card, index) => (
          <Grid key={index} item xs={4}>
            <ResultCard
              title={card.title}
              mainNumber={card.mainNumber}
              numbers={card.numbers} />
          </Grid>
        ))}
      </Grid>
    </div>
    <div className='grid-container'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <ResultsChart dataset={chartData} series={chartSeries} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <div className='grid-container'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <OrdersTable operations={operations} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div></>
  );
}

export default Analytics;
