import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { format } from 'date-fns'; // Importar función de formateo de fecha
import BotSelect from './BotSelect';

export default function ResultsChart({ dataset, bots }) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [selectedOption, setSelectedOption] = useState([]);

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
    balance: parseFloat(entry['balance_final']), // Convertir el balance a un número
    profit: parseFloat(entry['profit']),
    bot: entry['bot']
  }));

  // Filtrar el conjunto de datos según las opciones seleccionadas
  const filteredDataset = selectedOption.includes('all')
    ? formattedDataset
    : formattedDataset.filter(entry => selectedOption.includes(entry.bot));

  // Calcular el rango máximo y mínimo de fechas para el conjunto filtrado
  const minDate = Math.min(...filteredDataset.map(entry => entry.date));
  const maxDate = Math.max(...filteredDataset.map(entry => entry.date));

  useEffect(() => {
    setDateRange([minDate, maxDate]);
  }, [filteredDataset]);

  // Función de cambio para el slider de fechas
  const handleDateChange = (event, newValue) => {
    setDateRange(newValue);
  };

  // Función para formatear las fechas en el gráfico
  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy'); // Formatear la fecha como 'dd/MM/yyyy'
  };


// Definir series del gráfico
let series = [];

// Crear un conjunto de fechas completo para todas las series
const allDates = filteredDataset.map(entry => entry.date);

if (selectedOption.includes('all')) {
  // Si 'all' está seleccionado, agregar una serie que contenga todas las entradas del conjunto de datos sin filtrar
  series.push({
    id: 'all',
    label: 'All',
    data: formattedDataset.map(entry => entry.balance),
    curve: "linear"
  });
}

// Agregar series para cada bot seleccionado
selectedOption.forEach(bot => {
  if (bot !== 'all') {
    const filteredData = formattedDataset.filter(entry => entry.bot === bot);
    const botData = [];

    // Rellenar los valores de la serie con null donde sea necesario
    allDates.forEach(date => {
      const entry = filteredData.find(item => item.date.getTime() === date.getTime());
      if (entry) {
        botData.push(entry.balance);
      } else {
        botData.push(null);
      }
    });

    series.push({
      id: bot,
      label: bot,
      data: botData,
      curve: "linear",
      connectNulls: true,
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
          data: allDates, // Usar el conjunto completo de fechas
          scaleType: 'time',
          tickFormatter: formatDate, // Utilizar la función de formateo de fechas
        },
      ]}
      series={series}
      height={350}
      grid={{ vertical: true, horizontal: true }}
      legend
    />
    <Slider
      value={dateRange}
      onChange={handleDateChange}
      min={minDate}
      max={maxDate}
      valueLabelDisplay="off"
      sx={{ maxWidth: '92%' }}
    />
  </Box>
);

};
