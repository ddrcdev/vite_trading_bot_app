import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { format } from 'date-fns'; // Importar función de formateo de fecha
import BotSelect from './BotSelect';

export default function ResultsChart({ dataset, bots }) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [dateRangeSlider, setDateRangeSlider] = useState([new Date(), new Date()]);
  const [selectedOption, setSelectedOption] = useState(["all"]);
  const [isReady, setIsReady] = useState(false);
  // Select bots to graphs
  let botNames = [];
  if (Array.isArray(bots) && bots.length > 0) {
    botNames = [...bots];
  }
  botNames.unshift("all"); // Agrega "all" al principio del array

  const handleBotOptionChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedOption(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  // Convertir las fechas a objetos Date
  const formattedDataset = dataset.map(entry => ({
    date: new Date(entry['cdate']), // Suponiendo que 'cdate' es la clave de fecha
    profit: parseFloat(entry['profit']),
    bot: entry['bot']
  }));

  // Obtener un conjunto de fechas único para todos los bots
  const allDates = [...new Set(formattedDataset.map(entry => entry.date))];

  useEffect(() => {
    // Calcular el rango máximo y mínimo de fechas para la opción "all"
    const minDateAll = Math.min(...formattedDataset.map(entry => entry.date));
    const maxDateAll = Math.max(...formattedDataset.map(entry => entry.date));
    
    setDateRange([minDateAll, maxDateAll]); // Establecer el rango inicial basado en la opción "all"
    setDateRangeSlider([0, allDates.length - 1]); // Establecer el rango del slider en función de las fechas únicas
    setIsReady(true);
  }, []);

  // Función de cambio para el slider de fechas
  const handleDateChange = (event, newValue) => {
    const minDate = allDates[newValue[0]];
    const maxDate = allDates[newValue[1]];
    setDateRange([minDate, maxDate]);
    setDateRangeSlider(newValue);
  };

  // Función para calcular el valor acumulado de "profit" para un conjunto de datos
  const accumulateProfit = (data) => {
    let accumulatedProfit = 0;
    return data.map(entry => {
      accumulatedProfit += entry.profit;
      return accumulatedProfit;
    });
  };

  // Rellenar los valores faltantes con nulos para cada bot
  const fillMissingValues = (data, allDates) => {
    const filledData = [];
    allDates.forEach(date => {
      const entry = data.find(item => item.date.getTime() === date.getTime());
      if (entry) {
        filledData.push(entry);
      } else {
        filledData.push({ date: date, profit: null, bot: null });
      }
    });
    return filledData;
  };


  // Función para formatear las fechas en el gráfico
  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy'); // Formatear la fecha como 'dd/MM/yyyy'
  };
  
  // Definir series del gráfico
  let series = [];
  // Agregar series para cada bot seleccionado
  selectedOption.forEach(bot => {
    if (bot !== 'all') {
      const filteredData = formattedDataset.filter(entry => entry.bot === bot);
      const filledData = fillMissingValues(filteredData, allDates);
      const botProfit = accumulateProfit(filledData); // Utiliza el valor acumulado de "profit" para el bot específico

      series.push({
        id: bot,
        label: bot,
        data: botProfit,
        curve: "linear",
        connectNulls: true,
      });
    } else {
    // Si 'all' está seleccionado, agregar una serie que contenga todas las entradas del conjunto de datos sin filtrar
      series.push({
      id: 'all',
      label: 'All',
      data: accumulateProfit(formattedDataset), // Utiliza el valor acumulado de "profit" para todas las entradas
      curve: "linear"
    });
    }
  });

  // Renderizar el gráfico
  return (
    <Box sx={{ width: '100%' }}>
      <BotSelect
        botNames={botNames}
        selectedOption={selectedOption}
        handleBotOptionChange={handleBotOptionChange} 
      />
      <LineChart
        xAxis={[
          {
            id: 'Date',
            data: allDates, // Usar las fechas únicas para todos los bots
            scaleType: 'time',
            tickFormatter: formatDate, // Utilizar la función de formateo de fechas
          },
        ]}
        series={series}
        height={350}
        grid={{ vertical: true, horizontal: true }}
        legend
      />
      {isReady && ( // Renderizar el slider solo cuando el componente está listo
        <Slider
          value={dateRangeSlider}
          onChange={handleDateChange}
          min={0}
          max={allDates.length - 1} // Establecer el máximo como la longitud del array de fechas únicas
          sx={{ maxWidth: '92%' }}
          valueLabelDisplay='on'
          valueLabelFormat={formatDate}
        />
      )}
    </Box>
  );
}
