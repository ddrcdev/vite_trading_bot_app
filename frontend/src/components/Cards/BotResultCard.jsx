import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function ResultBotCard({ title,color_title, bot, numbers }) {
const text = ['Mean Profit:','Best Trade:','Worst Trade:'  ]
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="h4" style={{ color: color_title }}>{title}</Typography>
            <Typography variant="h5" style={{ color: 'black' }}>{bot}</Typography>
          </Grid>
          <Grid item xs={8}>
          {numbers.map((item, index) => {
            const number_usd = parseFloat(item.number_usd);
            const number_per = parseFloat(item.number_per);
            return (
              <Typography key={index} variant="h6" style={{ color: number_usd > 0 ? 'green' : number_usd < 0 ? 'red' : 'black' }}>
                {`${text[index]} ${number_usd.toFixed(2)}$ / ${number_per.toFixed(2)}%`}
              </Typography>
            );
          })}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ResultBotCard;
