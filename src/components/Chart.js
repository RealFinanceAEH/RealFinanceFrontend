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
    return <div>Нет данных для отображения</div>;
  }

  const chartData = {
    labels: data.map((item) => item.effective_date), // Используем даты как метки
    datasets: [
      {
        label: 'Курс',
        data: data.map((item) => item.ask), // Используем цену покупки (ask) как данные
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'График изменения курса',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Chart;