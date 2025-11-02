import React from 'react'
import * as styles from './ScaleChart.module.scss'

const ScaleChart = (props) => {
  const { category, totalQuantity, completedQuantity } = props
  const completedPercent =
    totalQuantity > 0 ? Math.round((completedQuantity / totalQuantity) * 100) : 0

  const getColor = (category) => {
    if (category === 'High') return '#FF4C4C'
    if (category === 'Middle') return '#FFA500'
    return '#4C9AFF'
  }

  return (
    <div className={styles.scaleWrapper}>
      <div className={styles.scaleWrapper__numbers}>
        <p className={styles.scaleWrapper__category}>
          <span>{category}</span> Category: {totalQuantity}
        </p>
        <p className={styles.scaleWrapper__completed}>Completed: {completedQuantity}</p>
      </div>

      <div className={styles.scaleWrapper__scaleContainer}>
        <div className={styles.scaleWrapper__scale}>
          <div
            className={styles.scaleWrapper__scaleFill}
            style={{
              width: `${completedPercent}%`,
              backgroundColor: getColor(category),
            }}
          ></div>
        </div>

        <p className={styles.scaleWrapper__scaleParcent}>({completedPercent}%)</p>
      </div>
    </div>
  )
}

export default ScaleChart
