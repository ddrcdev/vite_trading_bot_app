import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';

function CandleStickGraph({ priceData }) {
    console.log(priceData)
    const chartContainerRef = useRef();
    const chart = useRef();
    const resizeObserver = useRef();
    
    // Convertir los datos de precio al formato adecuado para el gráfico
    const formattedPriceData = priceData.map(record => ({
        time: {year: new Date(record[0]).getFullYear(),
            month: new Date(record[0]).getMonth(),
            day: new Date(record[0]).getDate()
        },
        open: parseFloat(record[1]), // Precio de apertura
        high: parseFloat(record[2]), // Precio más alto
        low: parseFloat(record[3]), // Precio más bajo
        close: parseFloat(record[4]), // Precio de cierre
        volume: parseFloat(record[5]) // Volumen
    }));

    console.log(formattedPriceData)

    useEffect(() => {
        chart.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                backgroundColor: '#171c28', // Cambio a un color de fondo oscuro
                textColor: 'rgba(255, 255, 255, 0.9)',
            },
            grid: {
                vertLines: {
                    color: '#334158',
                },
                horzLines: {
                    color: '#334158',
                },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            priceScale: {
                borderColor: '#485c7b',
                mode: 1, // Forzar la escala de precios en el lado derecho
            },
            timeScale: {
                borderColor: '#485c7b',
                visible: true, // Mostrar la escala de tiempo
                timeVisible: true, // Mostrar valores de tiempo en los ejes
            },
        });

        const candleSeries = chart.current.addCandlestickSeries({
            upColor: '#4bffb5',
            downColor: '#ff4976',
            borderDownColor: '#ff4976',
            borderUpColor: '#4bffb5',
            wickDownColor: '#838ca1',
            wickUpColor: '#838ca1',
        });

        candleSeries.setData(formattedPriceData);

        return () => {
            chart.current.remove();
            if (resizeObserver.current) {
                resizeObserver.current.disconnect();
            }
        };
    }, [formattedPriceData]);

    useEffect(() => {
        resizeObserver.current = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            chart.current.applyOptions({ width, height });
            setTimeout(() => {
                chart.current.timeScale().fitContent();
            }, 0);
        });

        resizeObserver.current.observe(chartContainerRef.current);

        return () => {
            if (resizeObserver.current) {
                resizeObserver.current.disconnect();
            }
        };
    }, []);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '95%' }} />;
}

export default CandleStickGraph;
