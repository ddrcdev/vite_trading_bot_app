import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';



function BalanceCard({ mainNumber, numbers }) {
  const text = ['Last 7D:','Last 30D:','All ops:'  ]
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="h4" style={{ color: 'black' }}>{'Balance'}</Typography>
            <Typography variant="h4" style={{ color: 'black' }}>{`${mainNumber}$`}</Typography>
          </Grid>
          <Grid item xs={6}>
            {numbers.map((item, index) => (
              <Typography key={index} variant="h5" style={{ color: item.number_usd > 0 ? 'green' : item.number_usd < 0 ? 'red' : 'balck' }}>
                {`${text[index]} ${item.number_usd.toFixed(2)}$ / ${item.number_per.toFixed(2)}%`}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default BalanceCard;


