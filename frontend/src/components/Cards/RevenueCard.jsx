import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function RevenueCard({ revenue }) {
  const isPositive = (value) => {
    return value > 0;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Expected Revenue
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body1">
              7D: 
              <span style={{ color: isPositive(revenue.sevenDays) ? 'green' : 'red' }}>
                {revenue.sevenDays}%
              </span>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">
              30D: 
              <span style={{ color: isPositive(revenue.thirtyDays) ? 'green' : 'red' }}>
                {revenue.thirtyDays}%
              </span>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">
              Year: 
              <span style={{ color: isPositive(revenue.year) ? 'green' : 'red' }}>
                {revenue.year}%
              </span>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default RevenueCard;
