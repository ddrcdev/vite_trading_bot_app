import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function BotResumeCard({ title, mainNumber, numbers }) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="h5" style={{ color: 'black' }}>{title}</Typography>
            <Typography variant="h6" style={{ color: 'black' }}>{mainNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            {numbers.map((item, index) => {
              let color;
              if (index === 0) {
                color = 'black'; // Primer elemento en naranja
              } else if (index === 1) {
                color = 'green'; // Segundo elemento en verde
              } else {
                color = 'red'; // Tercer elemento en rojo
              }
              return (
                <Typography key={index} variant="h6" style={{ color }}>
                  {item.text} {item.number}
                </Typography>
              );
            })}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default BotResumeCard;

