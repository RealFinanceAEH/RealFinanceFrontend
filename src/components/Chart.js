import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Chart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data to display</div>;
  }

  const chartData = {
    labels: data.map((item) => item.effective_date),
    datasets: [
      {
        label: 'Rate',
        data: data.map((item) => item.ask),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio preservation
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Exchange Rate Chart',
      },
    },
  };

  const containerStyle = {
    width: '100%', // Occupy full available width
    height: '400px', // Fixed height
  };

  return (
      <div style={containerStyle}>
        <Line data={chartData} options={options} />
      </div>
  );
};

export default Chart;
