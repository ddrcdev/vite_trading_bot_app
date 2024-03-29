import React, { useEffect, useRef, memo } from 'react';


function TradingViewWidget() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "height": "600",
        "autosize": false,
        "symbol": "BINANCE:BTCUSDT",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "es",
        "enable_publishing": false,
        "range": "YTD",
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "calendar": false,
        "studies": [
          "STD;Bollinger_Bands"
        ],
        "support_host": "https://www.tradingview.com"
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
    <div className="tradingview-widget-container" ref={container} style={{ height: "750px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100%)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        <span className="white-text">Track all markets on TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewWidget);
