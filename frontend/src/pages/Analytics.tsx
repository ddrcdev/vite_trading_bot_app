import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent } from '@mui/material';
import BalanceCard from '../components/Cards/BalanceCard'
import ResultsChart from '../components/ResultsGraph'; // Importa el componente del gráfico
import OrdersTable from '../components/OrdersTable';
import globalResultsData from '../assets/Results/global_results.json';
import '../App.css';


function Analytics() {
  const [operations, setOperations] = useState({});
  //Balance Card
  const [balance,setBalance] = useState(0)
  const [balanceData,setBalanceData] = useState([0])
  const [balanceDifs,setBalanceDifs] = useState([0,0,0])
  const [balanceDifsPer,setBalanceDifsPer] = useState([0,0,0])

  // Cargar trades
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

  // Cargar balanceData
  useEffect(() => {
    // Cargar los datos del archivo JSON cuando el componente se monta
    const fetchData = async (apiEndpoint: string) => {
      
      try {
        const response = await fetch(`http://localhost:5000/api/${apiEndpoint}`);
        const dataFromDB = await response.json();
        
        if (apiEndpoint === 'get/balance') {
          setBalanceData(dataFromDB)
          setBalance(dataFromDB[dataFromDB.length-1]['balance_final']);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    //Get Balance
    fetchData('get/balance');

    const currentDate = new Date();
    const currentBalance = balance;

    // Calcular la variación en los últimos 7 días
    const lastWeekDate = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    const lastWeekData = balanceData.filter(
      (item) => new Date(item["cdate"]) > lastWeekDate
    );
    let lastWeekBalance;
    if (lastWeekData.length === 0) {
      lastWeekBalance = currentBalance;
    } else {
      lastWeekBalance =
        lastWeekData[0]["balance_final"] - lastWeekData[0]["profit"];
    }

    const variationLastWeek = currentBalance - lastWeekBalance;
    const variationLastWeekPercentage =
      (variationLastWeek / lastWeekBalance) * 100;

    // Calcular la variación en el último mes
    const lastMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );
    const lastMonthData = balanceData.filter(
      (item) => new Date(item["cdate"]) > lastMonthDate
    );

    let lastMonthBalance;
    if (lastMonthData.length === 0) {
      lastMonthBalance = currentBalance;
    } else {
      lastMonthBalance =
        lastMonthData[0]["balance_final"] - lastMonthData[0]["profit"];
    }

    const variationLastMonth = currentBalance - lastMonthBalance;
    const variationLastMonthPercentage =
      (variationLastMonth / lastMonthBalance) * 100;

    // Calcular la variación total
    const firstBalance = balanceData[0]["balance_final"];
    const totalVariation = currentBalance - firstBalance;
    const totalVariationPercentage = (totalVariation / firstBalance) * 100;

    setBalanceDifs([variationLastWeek, variationLastMonth, totalVariation]);
    setBalanceDifsPer([
      variationLastWeekPercentage,
      variationLastMonthPercentage,
      totalVariationPercentage,
    ]);
  }, [balance]);


  return (
    <>
    <div className='card-container'>
      <Grid container spacing={1}>
        <Grid item xs={4}>
            <BalanceCard
                title={'Balance'}
                mainNumber={balance}
                numbers={[
                  { number_usd: balanceDifs[0], number_per: balanceDifsPer[0], text: 'Last 7D:' },
                  { number_usd: balanceDifs[1], number_per: balanceDifsPer[1],text: 'Last 30D:' },
                  { number_usd: balanceDifs[2], number_per: balanceDifsPer[2],text: 'All ops:' }
                ]} />
          </Grid>
          <Grid item xs={4}>
            <BalanceCard
                title={'Balance'}
                mainNumber={balance}
                numbers={[
                  { number_usd: balanceDifs[0], number_per: balanceDifsPer[0], text: 'Last 7D:' },
                  { number_usd: balanceDifs[1], number_per: balanceDifsPer[1],text: 'Last 30D:' },
                  { number_usd: balanceDifs[2], number_per: balanceDifsPer[2],text: 'All ops:' }
                ]} />
          </Grid>
          <Grid item xs={4}>
            <BalanceCard
                title={'Balance'}
                mainNumber={balance}
                numbers={[
                  { number_usd: balanceDifs[0], number_per: balanceDifsPer[0], text: 'Last 7D:' },
                  { number_usd: balanceDifs[1], number_per: balanceDifsPer[1],text: 'Last 30D:' },
                  { number_usd: balanceDifs[2], number_per: balanceDifsPer[2],text: 'All ops:' }
                ]} />
          </Grid>
          
      </Grid>
    </div>
    <div className='grid-container'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <ResultsChart dataset={balanceData} />
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
