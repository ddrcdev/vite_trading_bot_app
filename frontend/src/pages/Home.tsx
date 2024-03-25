import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import BalanceCard from '../components/Cards/BalanceCard'
import BotResumeCard from '../components/Cards/BotResumeCard'
import OrdersTable from '../components/OrdersTable';
import MarketBar from '../components/MarketTab'; // Importa el componente MarketBar
import TradingViewWidget from '../components/TradingViewWidget'; // Importa el componente TradingViewWidget
import MarketCapWidget from '../components/MarketCapWidget'
import '../App.css';

function Home() {
  const [operations, setOperations] = useState({});
  
  //Balance Card
  const [balance,setBalance] = useState(0)
  const [balanceDifs,setBalanceDifs] = useState([0,0,0])
  const [balanceDifsPer,setBalanceDifsPer] = useState([0,0,0])
  const [balanceData,setBalanceData] = useState([0])

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
            // Filtrar las propiedades vacías de cada objeto en el array
            const filteredOpenData = openTrades.map(obj => {
              return Object.entries(obj).reduce((acc, [key, value]) => {
                // Si el valor no es vacío, lo agregamos al objeto de salida
                if (value !== null && value !== undefined && value !== '') {
                  acc[key] = value;
                }
                return acc;
              }, {});
            });
            setOperations(filteredOpenData);
    
            // Obtener valores únicos de la columna "bot"
            const uniqueBots = [...new Set(openTrades.map(trade => trade.bot))];
            setActiveBots(uniqueBots.length);
    
            // Contar cuántas operaciones tienen status=open
            const openTradesCount = openTrades.length;
            setActiveOps(openTradesCount);
    
          }
        } else if (apiEndpoint === 'get/balance') {
          setBalance(dataFromDB[dataFromDB.length-1]['balance_final']);
          setBalanceData(dataFromDB)
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

  useEffect(() => {

    const currentDate = new Date();
    const currentBalance = balanceData[balanceData.length - 1]['balance_final'];

    // Calcular la variación en los últimos 7 días

    const lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekData = balanceData.filter((item) => new Date(item['cdate']) > lastWeekDate );
    let lastWeekBalance
    if (lastWeekData.length === 0) {
      lastWeekBalance = currentBalance;
    } else {
      lastWeekBalance = lastWeekData[0]['balance_final']-lastWeekData[0]['profit']
    };
    
    const variationLastWeek = currentBalance - lastWeekBalance;
    const variationLastWeekPercentage = (variationLastWeek / lastWeekBalance) * 100;

    // Calcular la variación en el último mes
    const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    const lastMonthData = balanceData.filter((item) => new Date(item['cdate']) > lastMonthDate);

    let lastMonthBalance
    if (lastMonthData.length === 0) {
      lastMonthBalance = currentBalance;
    } else {
      lastMonthBalance = lastMonthData[0]['balance_final']-lastMonthData[0]['profit']
    };

    const variationLastMonth = currentBalance - lastMonthBalance;
    const variationLastMonthPercentage = (variationLastMonth / lastMonthBalance) * 100;

    // Calcular la variación total
    const firstBalance =balanceData[0]['balance_final'];
    const totalVariation = currentBalance - firstBalance;
    const totalVariationPercentage = (totalVariation / firstBalance) * 100;

    console.log(balanceDifs)

    setBalanceDifs([variationLastWeek,variationLastMonth,totalVariation])
    setBalanceDifsPer([variationLastWeekPercentage,variationLastMonthPercentage,totalVariationPercentage])
    }, [balanceData]);


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
          <BalanceCard
              title={'Balance'}
              mainNumber={balance}
              numbers={[
                { number_usd: balanceDifs[0], number_per: balanceDifsPer[0], text: 'Last 7D:' },
                { number_usd: balanceDifs[1], number_per: balanceDifsPer[1],text: 'Last 30D:' },
                { number_usd: balanceDifs[2], number_per: balanceDifsPer[2],text: 'All ops:' }
              ]} />
        </Grid>
        <Grid item xs={6}>
          <BotResumeCard
            title={'Active Bots'}
            mainNumber={activeBots}
            numbers={[
              { number: activeOps, text: 'Active Ops:' },
              { number: winnerOps, text: 'Winner Ops:' },
              { number: looserOps, text: 'Looser Ops:' }
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

