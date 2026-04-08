import React, { useState, useEffect } from 'react';
import styles from './TaskList.module.scss';
import Task from '../Task/Task';
import TaskMobile from '../../TaskMobile/TaskMobile';
import { useSelector } from 'react-redux';
import { Pagination } from '@components/index';
import { NoData } from '@components/index';
import { RootState } from '@store/store';
import { FilterOption } from '@utils/fields/filterOptions';
import { TaskInterface } from '../../../../../types/task';

interface TaskListProps {
  keyword: string;
  selected: FilterOption;
}

const TaskList = ({ keyword, selected }: TaskListProps) => {
  const tasks: TaskInterface[] = useSelector((state: RootState) => state.tasks);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const taskPerPage = 10;

  const filteredTasks = tasks.filter((task) => {
    const matchesKeyword = !keyword || task.task.toLowerCase().includes(keyword.toLowerCase());

    const matchesCategoryOrStatus =
      !selected || selected === 'All' || task.category === selected || task.status === selected;

    return matchesKeyword && matchesCategoryOrStatus;
  });

  const totalPages: number = Math.ceil(filteredTasks.length / taskPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredTasks, currentPage, totalPages]);

  const indexOfLastTask: number = currentPage * taskPerPage;
  const indexOfFirstTask: number = indexOfLastTask - taskPerPage;
  const currentTasks: TaskInterface[] = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const pageNumbers: number[] = [currentPage, currentPage + 1].filter((page) => page <= totalPages);

  return (
    <div className={styles.taskList} data-testid="task-list">
      <div className={styles.taskList__content}>
        {filteredTasks.length > 0 && (
          <div className={styles.taskList__tableWrapper} data-testid="task-list-table">
            <table className={styles.taskList__table}>
              <colgroup>
                <col style={{ width: '100px' }} />
                <col style={{ width: '230px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '70px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Completed</th>
                  <th>Task Name</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Deadline</th>
                  <th>Remaining</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task) => (
                  <Task key={task._id} task={task} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredTasks.length < 1 && (
          <div className={styles.taskList__empty}>
            <NoData text="Nothing to see here… yet!" />
          </div>
        )}

        {filteredTasks.length > 0 && (
          <div className={styles.taskList__cardWrapper} data-testid="task-list-card-wrapper">
            {currentTasks.map((task) => (
              <TaskMobile key={task._id} task={task} data-testid="task-mobile" />
            ))}
          </div>
        )}
      </div>

      {filteredTasks.length > taskPerPage && (
        <Pagination
          pageNumbers={pageNumbers}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TaskList;
