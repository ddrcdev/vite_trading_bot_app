import React,{ useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import BalanceCard from '../components/Cards/BalanceCard'
import OrdersTable from '../components/OrdersTable';
import globalResultsData from '../assets/Results/global_results.json';
import '../App.css';

function Strategies() {
    const [operations, setOperations] = useState({});
    const [balance,setBalance] = useState(0);
    const [balanceDifs,setBalanceDifs] = useState([0,0,0]);
    const [balanceDifsPer,setBalanceDifsPer] = useState([0,0,0]);
    const [balanceData,setBalanceData] = useState([0]);    

    
  // Load trades
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

  


  return (
    <><div className='grid-container'>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <BalanceCard
                          mainNumber={balance}
                          numbers={[
                            { number_usd: balanceDifs[0], number_per: balanceDifsPer[0], text: 'Last 7D:' },
                            { number_usd: balanceDifs[1], number_per: balanceDifsPer[1],text: 'Last 30D:' },
                            { number_usd: balanceDifs[2], number_per: balanceDifsPer[2],text: 'All ops:' }
                          ]} />
            </Grid>
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