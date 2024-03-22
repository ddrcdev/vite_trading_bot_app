import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

const ResultsChart = ({ dataset, series }) => {
  const [reverseX, setReverseX] = useState(false);
  const [reverseLeft, setReverseLeft] = useState(false);
  const [reverseRight, setReverseRight] = useState(false);

  return (
    <Stack sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <ResponsiveChartContainer
          series={series}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'month',
              label: 'Month',
              reverse: reverseX,
            },
          ]}
          yAxis={[
            { id: 'leftAxis', reverse: reverseLeft },
            { id: 'rightAxis', reverse: reverseRight },
          ]}
          dataset={dataset}
          height={400}
        >
          <BarPlot />
          <LinePlot />
          <MarkPlot />

          <ChartsXAxis />
          <ChartsYAxis axisId="leftAxis" label="temerature (°C)" />
          <ChartsYAxis
            axisId="rightAxis"
            position="right"
            label="precipitation (mm)"
          />
        </ResponsiveChartContainer>
      </Box>
    </Stack>
  );
};

export default ResultsChart;
