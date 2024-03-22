import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import ResultCard from '../components/ResultCard';
import OrdersTable from '../components/OrdersTable';
import MarketBar from '../components/MarketTab'; // Importa el componente MarketBar
import TradingViewWidget from '../components/TradingViewWidget'; // Importa el componente TradingViewWidget
import MarketCapWidget from '../components/MarketCapWidget'
import '../App.css';

function Home() {
  const [operations, setOperations] = useState({});
  
  //Balance Card
  const [balance,setBalance] = useState(0)
  const [balanceDifs,setBalanceDifs] = useState([,,])

  // Active Trades Card
  const [activeBots,setActiveBots] = useState(0)
  const [activeOps,setActiveOps] = useState(0)
  const [winnerOps,setWinnerOps] = useState(0)
  const [looserOps,setLoserOps] = useState(0)

  useEffect(() => {
    // Cargar los datos del archivo JSON cuando el componente se monta
    const fetchData = async (apiEndpoint: string) => {
      try {
        const response = await fetch(`http://localhost:5000/api/${apiEndpoint}`);
        const dataFromDB = await response.json();
        
        if (apiEndpoint === 'get/trades') {
          // Filtrar las filas cuyo status es "open"
          const openTrades = dataFromDB.filter(trade => trade.status === 'Open');

          // Contar operaciones ganadoras
          const winnerOpsCount = dataFromDB.filter(trade => trade.diff > 0).length;
          setWinnerOps(winnerOpsCount);
    
          // Contar operaciones perdedoras
          const looserOpsCount = dataFromDB.filter(trade => trade.diff < 0).length;
          setLoserOps(looserOpsCount);
          
          if (openTrades.length === 0) {
            // Manejar el caso en el que no haya trades con status "Open"
            setActiveOps(0);
            setActiveBots(0);
            // Puedes establecer valores predeterminados o realizar otras acciones
          } else {
            // Actualizar el estado con las operaciones abiertas
            setOperations(openTrades);
    
            // Obtener valores únicos de la columna "bot"
            const uniqueBots = [...new Set(openTrades.map(trade => trade.bot))];
            setActiveBots(uniqueBots.length);
    
            // Contar cuántas operaciones tienen status=open
            const openTradesCount = openTrades.length;
            setActiveOps(openTradesCount);
    
          }
        } else if (apiEndpoint === 'get/balance') {
          console.log(dataFromDB)
          setBalance(dataFromDB[dataFromDB.length-1]['balance_final']);

          


        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    //Tabla de trades
    fetchData('get/trades');

    //Get Balance
    fetchData('get/balance');

  }, []);



  // Gestión del TAB de Trading View y MarketCap
  const [TDView, setValue] = useState(0); 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <>
      <div className='grid-container'>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ResultCard
            title={'Balance'}
            mainNumber={balance}
            numbers={ [
              { number: balanceDifs[0], text: '7D (%):' },
              { number: balanceDifs[1], text: '1M (%):' },
              { number: balanceDifs[2], text: 'All (%):' }
            ]} />
        </Grid>
        <Grid item xs={6}>
          <ResultCard
            title={'Active Bots'}
            mainNumber={activeBots}
            numbers={[
              { number: activeOps, text: 'Active Ops:' },
              { number: winnerOps, text: 'Winning:' },
              { number: looserOps, text: 'Loosing:' }
            ]} />
        </Grid>
      </Grid>
      </div>
      <div className = 'topo'>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Active Trades
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
      </div>
      <div className='grid-container'>
        <MarketBar value={TDView} handleChange={handleChange} /> {/* Utilizar el componente MarketBar */}
      </div>
      <div className='tradingv-container'>
        {TDView === 0 ? ( // Renderiza TradingView si value es 0
            <TradingViewWidget />
          ) : (
            <MarketCapWidget /> // Renderiza MarketCapData si value no es 0
          )}
      </div>
    </>
  );
}

export default Home;

