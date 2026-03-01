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
  ChartOptions,
  ChartData,
} from 'chart.js'
import styles from './BarChart.module.scss'
import { TaskInterface } from '../../../../types/task'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  tasks: TaskInterface[]
}

const BarChart = ({ tasks }: BarChartProps) => {
  const today = new Date()
  const last7DaysISO = []
  const last7DaysLabels = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)

    last7DaysISO.push(date.toISOString().split('T')[0])
    last7DaysLabels.push(date.toLocaleString('en-US', { day: 'numeric', month: 'long' }))
  }

  const counts = last7DaysISO.map((date) => {
    const count = tasks.filter((task) => task.createdAt.startsWith(date)).length
    return count > 10 ? 10 : count
  })

  const tooltipCounts = last7DaysISO.map((date) => {
    return tasks.filter((task) => task.createdAt.startsWith(date)).length
  })

  const data: ChartData<'bar', number[], string> = {
    labels: last7DaysLabels,
    datasets: [
      {
        data: counts,
        backgroundColor: '#4386dfff',
        borderRadius: 5,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tasks For The Last 7 Days',
        font: { size: 18, weight: 'bold' },
        padding: {
          top: 20,
          bottom: 20,
        },
        color: '#000',
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function (context) {
            return `Tasks: ${tooltipCounts[context.dataIndex]}`
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return value === 10 ? '10+' : value
          },
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

export default BarChart
