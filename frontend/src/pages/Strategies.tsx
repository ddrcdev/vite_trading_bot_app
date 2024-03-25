import React,{ useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import ResultCard from '../components/ResultCard';
import OrdersTable from '../components/OrdersTable';
import globalResultsData from '../assets/Results/global_results.json';
import '../App.css';

function Strategies() {
    const [operations, setOperations] = useState({});
    const [balance,setBalance] = useState(0)
    const [balanceDifs,setBalanceDifs] = useState([2.3,4,-2.1])

    useEffect(() => {
      // Cargar los datos del archivo JSON cuando el componente se monta
        const fetchTrades = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/get/trades'); // Hacer una solicitud a la API REST en el servidor backend
          const dataFromDB = await response.json();
          setOperations(dataFromDB);
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
      fetchTrades();
    }, []);

    useEffect(() => {
      // Cargar los datos del archivo JSON cuando el componente se monta
        const fetchBalance = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/get/balance'); // Hacer una solicitud a la API REST en el servidor backend
          const dataFromDB = await response.json();
          console.log(dataFromDB);
          setBalance(dataFromDB);
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
      fetchBalance();
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
      title: 'Actives Ops',
      mainNumber: 'Active Bots',
      numbers: [
        { number: 600, text: 'Active Ops:' },
        { number: 700, text: 'Winning:' },
        { number: 800, text: 'Loosing:' }
      ]
    },
  ];

  return (
    <><div className='grid-container'>
          <Grid container spacing={2}>
              {cardData.map((card, index) => (
                  <Grid key={index} item xs={6}>
                      <ResultCard
                          title={'Balance'}
                          mainNumber={balance}
                          numbers={card.numbers} />
                  </Grid>
              ))}
          </Grid>
      </div>
      <div className = 'topo'>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          All Trades
        </Typography>
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

export default Strategies