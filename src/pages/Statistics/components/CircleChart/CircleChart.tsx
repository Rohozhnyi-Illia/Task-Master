import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  ChartData,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from './CircleChart.module.scss';
import { CategoryType } from '../../../../types/task';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface CircleChartItem {
  category: CategoryType;
  value: number;
}

interface CircleChartProps {
  data: CircleChartItem[];
  title: string;
}

const CircleChart = ({ data, title }: CircleChartProps) => {
  const [chartData, setChartData] = useState<ChartData<'doughnut', number[], string>>({
    labels: [],
    datasets: [{ data: [], backgroundColor: [], borderWidth: 1 }],
  });

  useEffect(() => {
    const COLORS = ['#999999', '#b32929', '#e79805', '#4386dfff'];
    const timer = setTimeout(() => {
      setChartData({
        labels: data.map((item) => item.category),
        datasets: [
          {
            data: data.map((item) => item.value),
            backgroundColor: COLORS,
            borderWidth: 1,
          },
        ],
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [data]);

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutCubic',
      animateRotate: true,
      animateScale: true,
    },
    cutout: '20%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#000',
          boxWidth: 12,
          padding: 15,
          font: { size: 14 },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#000',
        font: { size: 18, weight: 'bold' },
      },
      datalabels: {
        color: '#000',
        font: { weight: 'bold', size: 18 },
        formatter: (value) => value,
      },
    },
  };

  return (
    <div style={{ position: 'relative' }} className={styles.circle}>
      <Doughnut data={chartData} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default CircleChart;
