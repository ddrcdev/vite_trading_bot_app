import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function ResultsChart({ dataset }) {

  // Check if the dataset is an empty array
  if (!Array.isArray(dataset) || dataset.length === 0) {
    // If dataset is an empty array, return a placeholder message or component
    return <div>No data available</div>;
  }


  console.log(dataset)
  // Render the LineChart component with the specified key
  return (
    <LineChart
      xAxis={[
        {
          id: 'Date',
          data: dataset.map(entry => entry['cdate']), // Assuming 'cdate' is the date key
          scaleType: 'time',

        },
      ]}
      series={[
        {
          id: 'Balance',
          label: 'Balance variation ($)',
          data: dataset.map(entry => entry['balance_final']),
        },
      ]}
      height={350}
    />
  );
}
