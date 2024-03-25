import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function BalanceCard({ title, mainNumber, numbers }) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="h5" style={{ color: 'black' }}>{title}</Typography>
            <Typography variant="h6" style={{ color: 'black' }}>{mainNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            {numbers.map((item, index) => (
              <Typography key={index} variant="h6" style={{ color: item.number_usd > 0 ? 'green' : item.number_usd < 0 ? 'red' : 'balck' }}>
                {`${item.text} ${item.number_usd.toFixed(2)}$ / ${item.number_per.toFixed(2)}%`}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default BalanceCard;


