import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function ResultCard({ title, mainNumber, numbers }) {
  const textStyle = { color: 'black' }; // Estilo para el texto en negro

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="h5" style={textStyle}>{title}</Typography>
            <Typography variant="h6" style={textStyle}>{mainNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            {numbers.map((item, index) => (
              <Typography key={index} variant="h6" style={{ color: item.number >= 0 ? 'green' : 'red' }}>
                {item.text} {item.number} 
              </Typography>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ResultCard;

