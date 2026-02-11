import React, { useMemo, lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import * as styles from './StatsPage.module.scss'
import ScaleChart from './components/ScaleChart/ScaleChart'
import categories from '@utils/fields/taskCategories'
import { SuspenseLoader } from '@components'

const CircleChart = lazy(() => import('./components/CircleChart/CircleChart'))
const BarChart = lazy(() => import('./components/BarChart/BarChart'))
const StackedBarChart = lazy(() => import('./components/StackedBarChart/StackedBarChart'))

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
    <Suspense fallback={<SuspenseLoader />}>
      <div className={styles.stats}>
        <div className="container">
          <h2 className={styles.stats__title}>Hello, {name}</h2>
          <h4 className={styles.stats__subtitle}>Here’s a snapshot of your productivity.</h4>

          <div className={styles.stats__container}>
            <div className={styles.stats__scalesWrapper}>
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

            <div className={styles.stats__circleWrapper}>
              <CircleChart data={circleData} title={'Tasks By Category'} key={Math.random()} />
            </div>
          </div>

          <div className={styles.stats__container}>
            <div className={styles.stats__stackedBarWrapper}>
              <StackedBarChart tasks={tasks} />
            </div>

            <div className={styles.stats__barWrapper}>
              <BarChart tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default StatsPage
