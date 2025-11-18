import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import * as styles from './StackedBarChart.module.scss'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const StackedBarChart = ({ tasks }) => {
  const categories = ['High', 'Middle', 'Low']

  const activeCounts = categories.map(
    (cat) => tasks.filter((task) => task.category === cat && task.status === 'Active').length
  )
  const doneCounts = categories.map(
    (cat) => tasks.filter((task) => task.category === cat && task.status === 'Done').length
  )

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Active',
        data: activeCounts,
        backgroundColor: '#e79805',
      },
      {
        label: 'Done',
        data: doneCounts,
        backgroundColor: '#4386dfff',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
      title: {
        display: true,
        text: 'Tasks by Category and Status',
        font: { size: 18, weight: 'bold' },
        color: '#000',
        padding: { top: 20, bottom: 20 },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className={styles.chartContainer}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default StackedBarChart
