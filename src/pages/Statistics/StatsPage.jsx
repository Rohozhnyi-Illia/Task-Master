import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import * as styles from './StatsPage.module.scss'
import ScaleChart from './components/ScaleChart/ScaleChart'
import CircleChart from './components/CircleChart/CircleChart'
import categories from '@utils/fields/taskCategories'

const StatsPage = () => {
  const name = useSelector((state) => state.auth.name)
  const tasks = useSelector((state) => state.tasks)

  const statsData = useMemo(() => {
    return categories.map((category) => {
      const tasksOfCategory = tasks.filter((task) => task.category === category)
      const completed = tasksOfCategory.filter((task) => task.status === 'Done').length

      return {
        category,
        totalQuantity: tasksOfCategory.length,
        completedQuantity: completed,
      }
    })
  }, [tasks])

  const circleData = statsData.map(({ category, totalQuantity }) => ({
    category,
    value: totalQuantity,
  }))

  return (
    <div className={styles.stats}>
      <div className="container">
        <h2 className={styles.stats__title}>Hello, {name}</h2>
        <h4 className={styles.stats__subtitle}>Here’s a snapshot of your productivity.</h4>

        <div className={styles.stats__container}>
          <div className={styles.stats__scales}>
            <h5 className={styles.stats__total}>Total Tasks: {tasks.length}</h5>

            {statsData.map(({ category, totalQuantity, completedQuantity }) => (
              <ScaleChart
                key={category}
                totalQuantity={totalQuantity}
                category={category}
                completedQuantity={completedQuantity}
              />
            ))}
          </div>

          <div className={styles.stats__chart}>
            <CircleChart data={circleData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage
