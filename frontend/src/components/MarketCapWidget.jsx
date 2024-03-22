import React, { useEffect, useRef, memo } from 'react';

function MarketCapWidget() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
    {
      "symbolsGroups": [
        {
          "name": "Crypto",
          "symbols": [
            {
              "name": "BINANCE:BTCUSDT"
            },
            {
              "name": "BINANCE:SOLUSDT"
            },
            {
              "name": "BINANCE:ETHUSDT"
            },
            {
              "name": "BINANCE:ADAUSDT"
            },
            {
              "name": "BINANCE:PEPEUSDT"
            },
            {
              "name": "BINANCE:XRPUSDT"
            },
            {
              "name": "BINANCE:MATICUSDT"
            },
            {
              "name": "BINANCE:BNBUSDT"
            },
            {
              "name": "BINANCE:DOTUSDT"
            },
            {
              "name": "BINANCE:VETUSDT"
            }
          ]
        },
        {
          "name": "Indices",
          "originalName": "Indices",
          "symbols": [
            {
              "name": "FOREXCOM:SPXUSD",
              "displayName": "S&P 500 Index"
            },
            {
              "name": "FOREXCOM:NSXUSD",
              "displayName": "US 100 Cash CFD"
            },
            {
              "name": "FOREXCOM:DJI",
              "displayName": "Dow Jones Industrial Average Index"
            },
            {
              "name": "INDEX:NKY",
              "displayName": "Nikkei 225"
            },
            {
              "name": "INDEX:DEU40",
              "displayName": "DAX Index"
            },
            {
              "name": "FOREXCOM:UKXGBP",
              "displayName": "FTSE 100 Index"
            }
          ]
        },
        {
          "name": "Forex",
          "originalName": "Forex",
          "symbols": [
            {
              "name": "FX:EURUSD",
              "displayName": "EUR to USD"
            },
            {
              "name": "FX:GBPUSD",
              "displayName": "GBP to USD"
            },
            {
              "name": "FX:USDJPY",
              "displayName": "USD to JPY"
            },
            {
              "name": "FX:USDCHF",
              "displayName": "USD to CHF"
            },
            {
              "name": "FX:AUDUSD",
              "displayName": "AUD to USD"
            },
            {
              "name": "FX:USDCAD",
              "displayName": "USD to CAD"
            }
          ]
        }
      ],
      "showSymbolLogo": true,
      "isTransparent": false,
      "colorTheme": "dark",
      "locale": "es",
      "backgroundColor": "#131722"
    }`;
    if (container.current) {
      container.current.appendChild(script);
    }

  // Cleanup function
  return () => {
    if (container.current && script.parentNode) {
      container.current.removeChild(script);
    }
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez

  return (
    <div className="tradingview-widget-container" style={{ height: "750px", width: "100%" }} ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://es.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="white-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(MarketCapWidget);
