import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CandlestickChart from "../components/Strategies/candleStickGraph";
import StrategyForm from "../components/Strategies/StrategyForm";
import StrategyMetricsCard from "../components/Cards/StrategyMetricsCard";
import RevenueCard from "../components/Cards/RevenueCard";

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
    const fetchMarketKline = async () => {
      try {
        if (
          strategyData.nombre !== "" &&
          strategyData.mercado !== "" &&
          strategyData.intervalo !== "" &&
          strategyData.tipo !== ""
        ) {
          // Construir la solicitud para obtener los datos de Kline/Candlestick
          const symbol = strategyData.mercado;
          const interval = strategyData.intervalo;
          // Aquí puedes ajustar startTime, endTime y timeZone según tus necesidades
          const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`
          );

          if (!response.ok) {
            throw new Error("Error al obtener los datos de Kline/Candlestick");
          }

          const data = await response.json();
          setMarketKLine(data);
        }
      } catch (error) {
        console.error(
          "Error al obtener los datos de Kline/Candlestick:",
          error
        );
      }
    };

    fetchMarketKline();
  }, [strategyData]); // Ejecutar el efecto cuando cambie strategyData

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
        <div className="grid-container">
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <CandlestickChart priceData={marketKline} />
            </Grid>
            <Grid item xs={4}>
              <div style={{ height: "50%" }}>
                <StrategyMetricsCard
                  trades={{ total: 19, winner: 14, loser: 5 }}
                  profit={14}
                  deviation={3}
                  time={1}
                />
              </div>
              <div style={{ height: "50%" }}>
                <RevenueCard revenue={{ sevenDays: 5, thirtyDays: -10, year: 20 }} />
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

export default Strategies;


