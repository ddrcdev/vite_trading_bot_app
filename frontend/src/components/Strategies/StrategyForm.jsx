import React from 'react';
import { Card, CardContent, Typography, TextField, MenuItem } from '@mui/material';

function StrategyForm({ strategyData, symbols, intervals, handleInputChange }) {
  return (
    <Card style={{ height: '100%' }}>
      <CardContent style={{ marginBottom: '10px' }}>
        <Typography variant="h5" component="h2">
          Fill Strategy Data
        </Typography>
        <TextField name="nombre" label="Nombre" fullWidth value={strategyData.nombre} onChange={handleInputChange} />
        <TextField
          select
          name="mercado"
          label="Mercado"
          fullWidth
          variant="outlined"
          defaultValue=""
          style={{ marginTop: '10px' }}
          value={strategyData.mercado}
          onChange={handleInputChange}
        >
          {symbols.map((symbol, index) => (
            <MenuItem key={index} value={symbol}>{symbol}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="intervalo"
          label="Intervalo"
          fullWidth
          variant="outlined"
          defaultValue=""
          style={{ marginTop: '10px' }}
          value={strategyData.intervalo}
          onChange={handleInputChange}
        >
          {intervals.map((interval, index) => (
            <MenuItem key={index} value={interval}>{interval}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="tipo"
          label="Tipo de estrategia"
          fullWidth
          variant="outlined"
          defaultValue=""
          style={{ marginTop: '10px' }}
          value={strategyData.tipo}
          onChange={handleInputChange}
        >
          <MenuItem value="tipo1">Tipo 1</MenuItem>
          <MenuItem value="tipo2">Tipo 2</MenuItem>
          <MenuItem value="tipo3">Tipo 3</MenuItem>
        </TextField>
      </CardContent>
    </Card>
  );
}

export default StrategyForm;
