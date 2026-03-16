import React, { useMemo, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import styles from './StatsPage.module.scss';
import ScaleChart from './components/ScaleChart/ScaleChart';
import { CATEGORIES_OPTIONS, CategoryType, TaskInterface } from '../../types/task';
import { SuspenseLoader } from '@components/index';
import { RootState } from '@store/store';
import { GreetingBadge } from '@components/index';

const CircleChart = lazy(() => import('./components/CircleChart/CircleChart'));
const BarChart = lazy(() => import('./components/BarChart/BarChart'));
const StackedBarChart = lazy(() => import('./components/StackedBarChart/StackedBarChart'));

interface StatsDataItem {
  category: CategoryType;
  totalQuantity: number;
  completedQuantity: number;
}

interface CircleDataItem {
  category: CategoryType;
  value: number;
}

const StatsPage = () => {
  const name: string = useSelector((state: RootState) => state.auth.name);
  const tasks: TaskInterface[] = useSelector((state: RootState) => state.tasks);

  const statsData: StatsDataItem[] = useMemo(() => {
    return CATEGORIES_OPTIONS.map((category) => {
      const tasksOfCategory = tasks.filter((task) => task.category === category);
      const completed = tasksOfCategory.filter((task) => task.status === 'Done').length;

      return {
        category,
        totalQuantity: tasksOfCategory.length,
        completedQuantity: completed,
      };
    });
  }, [tasks]);

  const circleData: CircleDataItem[] = statsData.map(({ category, totalQuantity }) => ({
    category,
    value: totalQuantity,
  }));

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <div className={styles.stats}>
        <div className="container">
          <GreetingBadge name={name} subtitle="Here’s a snapshot of your productivity" />

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
  );
};

export default StatsPage;
