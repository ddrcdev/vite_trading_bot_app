import React, { useState, useEffect } from "react";
import {Grid, Card, CardContent, Typography, Button} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CandlestickChart from "../components/Strategies/candleStickGraph";
import StrategyForm from "../components/Strategies/StrategyForm";
import StrategyMetricsCard from "../components/Cards/StrategyMetricsCard";
import RevenueCard from "../components/Cards/RevenueCard";
import OrdersTable from '../components/OrdersTable';

import "../App.css";

function Strategies() {
  const [showSecondCard, setShowSecondCard] = useState(false);
  const [symbols, setSymbols] = useState([]);
  const intervals = [
    "1s",
    "1m",
    "3m",
    "5m",
    "15m",
    "30m",
    "1h",
    "2h",
    "4h",
    "6h",
    "8h",
    "12h",
    "1d",
    "3d",
    "1w",
    "1M",
  ];
  const [strategyData, setStrategyData] = useState({
    nombre: "",
    mercado: "",
    intervalo: "",
    tipo: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [marketKline, setMarketKLine] = useState({});
  const [actions, setActions] = useState({});

  const toggleSecondCard = () => {
    setShowSecondCard(!showSecondCard);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStrategyData({ ...strategyData, [name]: value });
  };

  const handleRunClick = () => {
    if (Object.values(strategyData).every((value) => value !== "")) {
      setShowResult(true);
    } else {
      alert("Por favor, rellena todos los campos.");
    }
  };

  // Load symbols on trading XXXX/USDT
  useEffect(() => {
    const fetchExchangeInfo = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/exchangeInfo"
        );
        if (response.ok) {
          const data = await response.json();
          const filteredSymbols = data.symbols.filter((symbol) => {
            return (
              symbol.status.includes("TRADING") &&
              symbol.permissions.includes("SPOT") &&
              symbol.quoteAsset.includes("USDT")
            );
          });
          setSymbols(filteredSymbols.map((symbol) => symbol.symbol));
        } else {
          console.error("Failed to fetch exchange info:", response.status);
        }
      } catch (error) {
        console.error("Error fetching exchange info:", error);
      }
    };

    fetchExchangeInfo();
  }, []);

  // Load k-line from selected Market
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
          const response = await fetch("api/get/token_data");
          const tokenData = await response.json();
          console.log(tokenData)
          
          if (tokenData.length === 0) {
            fetchMarketKline();
            throw new Error("La tabla tokenData está vacía");
          } else {
            // Verificar si tenemos el símbolo y el intervalo seleccionado
            const hasSelectedTokenData = tokenData.some(item => 
              item.symbol === strategyData.mercado && 
              item.interval === strategyData.intervalo
          );
          // Si tenemos el tokenData seleccionado, no necesitamos hacer otra solicitud
          if (!hasSelectedTokenData) {
            fetchMarketKline();
          }
        } 
      } catch (error) {
        console.error("Error al obtener los datos del token:", error);
      }
    };
    const fetchMarketKline = async () => {
      try {
        const symbol = strategyData.mercado;
        const interval = strategyData.intervalo;
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos de Kline/Candlestick");
        }
        const data = await response.json();
        setMarketKLine(data);
      } catch (error) {
        console.error("Error al obtener los datos de Kline/Candlestick:", error);
      }
    };
    fetchTokenData();
  }, [strategyData]); // Ejecutar el efecto cuando cambie strategyData

  // Load Strategy BackAnalysis
  useEffect(() => {
    // Cargar los datos del archivo JSON cuando el componente se monta
    const makeBackAnalysisPy = async () => {
      
      try {
        // Realizar una solicitud POST al backend para ejecutar el script de Python
        const response = await fetch(
          "http://localhost:5000/api/post/strategy-backanalysis",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: marketKline }),
          }
        );
        console.log(response)

        const data = await response.json();

        setActions(data); // Establecer el estado dentro de la función
        console.log(actions);

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    // Llamar a la función para ejecutar el script de Python cuando el valor de marketKline cambie
    if (
      marketKline 
    ) {
      makeBackAnalysisPy();
    }
  }, [marketKline]);

  return (
    <div>
      <div className="card-container">
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card style={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Create new Strategy
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={toggleSecondCard}
                  style={{ marginTop: "10px", width: "100%" }}
                >
                  {showSecondCard ? "Hide Form" : "Show Form"}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {showSecondCard && (
            <Grid item xs={8}>
              <div style={{ width: "100%" }}>
                <StrategyForm
                  strategyData={strategyData}
                  symbols={symbols}
                  intervals={intervals}
                  handleInputChange={handleInputChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px", width: "100%" }}
                  onClick={handleRunClick}
                >
                  <PlayArrowIcon />
                </Button>
              </div>
            </Grid>
          )}
        </Grid>
      </div>

      {showResult && (
        <>
          <div className="grid-container">
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <div className="chart-container">
                  <CandlestickChart priceData={marketKline} />
                </div>
              </Grid>
              <Grid item xs={4}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <div style={{ marginBottom: "2%" }}>
                      <StrategyMetricsCard
                        trades={{ total: 19, winner: 14, loser: 5 }}
                        profit={14}
                        deviation={3}
                        time={1}
                      />
                    </div>
                  </Grid>
                  <Grid item>
                    <RevenueCard
                      revenue={{ sevenDays: 5, thirtyDays: -10, year: 20 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div className="grid-container">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <OrdersTable operations={actions} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </div>
  );
}

export default Strategies;


