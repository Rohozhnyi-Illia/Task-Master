import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import * as styles from './CircleChart.module.scss'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

const CircleChart = ({ data, title }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [], borderWidth: 1 }],
  })

  useEffect(() => {
    const COLORS = ['#FF4C4C', '#FFA500', '#4C9AFF']
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
      })
    }, 50)

    return () => clearTimeout(timer)
  }, [data])

  const options = {
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
  }

  return (
    <div style={{ position: 'relative' }} className={styles.circle}>
      <Doughnut data={chartData} options={options} plugins={[ChartDataLabels]} />
    </div>
  )
}

export default CircleChart
