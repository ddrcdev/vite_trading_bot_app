import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function StrategyMetricsCard({ trades, profit, deviation, time }) {
  const isPositive = (value) => {
    return value > 0;
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom className="MuiTypography-gutterBottom" textAlign="center">
          Back Analysis Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign="center">
              Nº trades:
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign="center">
              Av.Profit/dev.st:
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign="center">
              Time av. per trade:
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign="center">
                <span style={{ color: 'black'}}>{trades.total} / </span>
                <span style={{ color: 'green'}}>{trades.winner}</span>{' / '}
                <span style={{ color: 'red' }}>{trades.loser}</span>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign="center">
              <span style={{ color: 'green'}}>{profit}% </span>{'/  '}
              <span style={{ color: 'green'}}>{deviation}%</span>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign="center">
              {time} days
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StrategyMetricsCard;
