import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import BalanceCard from '../components/Cards/BalanceCard';
import ResultBotCard from '../components/Cards/BotResultCard';
import BalanceChart from '../components/BalanceGraph/BalanceGraph'; // Importa el componente del gráfico
import OrdersTable from '../components/OrdersTable';

import '../App.css';


function Analytics() {
  const [operations, setOperations] = useState({});
  const [botNames, setBots] = useState({});

  //Balance Card
  const [balance,setBalance] = useState(0);
  const [balanceData,setBalanceData] = useState([0]);
  const [balanceDifs,setBalanceDifs] = useState([0,0,0]);
  const [balanceDifsPer,setBalanceDifsPer] = useState([0,0,0]);

  //BotResultsCard
  const [winnerData, setWinnerData] = useState({bot:'', av_profit: 0,av_diff: 0, best_trade: 0,best_trade_diff: 0, worst_trade: 0, worst_trade_diff: 0});
  const [looserData, setLooserData] = useState({bot:'', av_profit: 0,av_diff: 0, best_trade: 0,best_trade_diff: 0, worst_trade: 0, worst_trade_diff: 0});


  // Load trades
  useEffect(() => {
    // Cargar los datos del archivo JSON cuando el componente se monta
      const fetchTrades = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get/trades'); // Hacer una solicitud a la API REST en el servidor backend
        const dataFromDB = await response.json();
        setOperations(dataFromDB);

        const uniqueBotNames = [...new Set(dataFromDB.map(operation => operation.bot))];
        setBots(uniqueBotNames); // Establecer los nombres de los bots

      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchTrades();
  }, []);

  // Load balanceData
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

  // Load Winner/Looser Bots
  useEffect(()=>{
    const fetchWinnerMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get/winner-bot'); // Hacer una solicitud a la API REST en el servidor backend
        const dataFromDB = await response.json();
        setWinnerData(dataFromDB[0]);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    const fetchLooserMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get/looser-bot'); // Hacer una solicitud a la API REST en el servidor backend
        const dataFromDB = await response.json();
        setLooserData(dataFromDB[0])
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchWinnerMetrics();
    fetchLooserMetrics();

  },[])

  return (
    <>
    <div className='card-container'>
      <Grid container spacing={1}>
        <Grid item xs={4}>
            <BalanceCard
                mainNumber={balance}
                numbers={[
                  { number_usd: balanceDifs[0], number_per: balanceDifsPer[0]},
                  { number_usd: balanceDifs[1], number_per: balanceDifsPer[1]},
                  { number_usd: balanceDifs[2], number_per: balanceDifsPer[2]}
                ]} />
          </Grid>
          <Grid item xs={4}>
            <ResultBotCard
                title={'Winner Bot'}
                color_title={'green'}
                bot={winnerData['bot']}
                numbers={[
                  { number_usd: winnerData['av_profit'], number_per: winnerData['av_diff']},
                  { number_usd: winnerData['best_trade'], number_per: winnerData['best_trade_diff']},
                  { number_usd: winnerData['worst_trade'], number_per: winnerData['worst_trade_diff']}
                ]} />
          </Grid>
          <Grid item xs={4}>
            <ResultBotCard
                  title={'Looser Bot'}
                  color_title={'red'}
                  bot={looserData['bot']}
                  numbers={[
                    { number_usd: looserData['av_profit'], number_per: looserData['av_diff']},
                    { number_usd: looserData['best_trade'], number_per: looserData['best_trade_diff']},
                    { number_usd: looserData['worst_trade'], number_per: looserData['worst_trade_diff']}
                  ]} />
          </Grid>
      </Grid>
    </div>
    <div className='card-container'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <BalanceChart dataset={balanceData} bots={botNames} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <div className='grid-container'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
          <div className = 'topo'>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              All Trades
            </Typography>
          </div>
          </Grid>
        </Grid>
      </div>
      <div className='grid-container'>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <OrdersTable operations={operations} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Analytics;
