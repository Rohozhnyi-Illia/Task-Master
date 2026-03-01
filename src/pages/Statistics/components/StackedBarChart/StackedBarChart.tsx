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
  ChartData,
  ChartOptions,
} from 'chart.js'
import styles from './StackedBarChart.module.scss'
import { CATEGORIES_OPTIONS, TaskInterface } from '../../../../types/task'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface StackedBarChartProps {
  tasks: TaskInterface[]
}

const StackedBarChart = ({ tasks }: StackedBarChartProps) => {
  const activeCounts = CATEGORIES_OPTIONS.map(
    (category) =>
      tasks.filter((task) => task.category === category && task.status === 'Active').length,
  )
  const doneCounts = CATEGORIES_OPTIONS.map(
    (category) =>
      tasks.filter((task) => task.category === category && task.status === 'Done').length,
  )

  const inProgressCounts = CATEGORIES_OPTIONS.map(
    (category) =>
      tasks.filter((task) => task.category === category && task.status === 'InProgress')
        .length,
  )

  const archivedCounts = CATEGORIES_OPTIONS.map(
    (category) =>
      tasks.filter((task) => task.category === category && task.status === 'Archived').length,
  )

  const data: ChartData<'bar', number[], string> = {
    labels: [...CATEGORIES_OPTIONS],
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
      {
        label: 'InProgress',
        data: inProgressCounts,
        backgroundColor: '#b32929',
      },
      {
        label: 'Archived',
        data: archivedCounts,
        backgroundColor: '#999999',
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
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
