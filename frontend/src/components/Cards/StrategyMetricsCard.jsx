import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function StrategyMetricsCard({ trades, profit, deviation, time }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
            Back Analysis Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="body1">
              Nº trades: {trades.total}
              <span>
                /<span style={{ color: 'green' }}>{trades.winner}</span>
                (win)/<span style={{ color: 'red' }}>{trades.loser}</span>(loose)
                
            </span>
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1">
              Av.Profit/dev.st: {profit}% / {deviation}%
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1">
              Time av. per trade (days): {time}
            </Typography>
          </Grid>
          {/* Add more Grid items for additional metrics */}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StrategyMetricsCard;
