import React from 'react'
import * as styles from './ScaleChart.module.scss'

const ScaleChart = (props) => {
  const { category, totalQuantity, completedQuantity } = props
  const completedPercent = Math.round((completedQuantity / totalQuantity) * 100)

  return (
    <div className={styles.scaleWrapper}>
      <div className={styles.scaleWrapper__numbers}>
        <p className={styles.scaleWrapper__category}>
          <span>{category}</span> Category: {totalQuantity}
        </p>
        <p className={styles.scaleWrapper__completed}>Completed: {completedQuantity}</p>
      </div>

      <div className={styles.scaleWrapper__scale}>
        <div
          className={styles.scaleWrapper__scaleFill}
          style={{ width: `${completedPercent}%` }}
        ></div>
        <p className={styles.scaleWrapper__scaleParcent}>{completedPercent}%</p>
      </div>
    </div>
  )
}

export default ScaleChart
