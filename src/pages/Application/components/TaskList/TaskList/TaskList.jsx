import React, { useState, useEffect } from 'react'
import * as styles from './TaskList.module.scss'
import { noData } from '@assets'
import Task from '../Task/Task'
import TaskMobile from '../TaskMobile/TaskMobile'
import { useSelector } from 'react-redux'
import { Pagination } from '@components'

const TaskList = ({ keyword, selected }) => {
  const tasks = useSelector((state) => state.tasks)
  const [currentPage, setCurrentPage] = useState(1)
  const taskPerPage = 10

  const filteredTasks = tasks.filter((task) => {
    const matchesKeyword = !keyword || task.task.toLowerCase().includes(keyword.toLowerCase())

    const matchesCategoryOrStatus =
      !selected || selected === 'All' || task.category === selected || task.status === selected

    return matchesKeyword && matchesCategoryOrStatus
  })

  const totalPages = Math.ceil(filteredTasks.length / taskPerPage)

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [filteredTasks, currentPage, totalPages])

  const indexOfLastTask = currentPage * taskPerPage
  const indexOfFirstTask = indexOfLastTask - taskPerPage
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask)

  const pageNumbers = [currentPage, currentPage + 1].filter((page) => page <= totalPages)

  return (
    <div className={styles.taskList}>
      <div className={styles.taskList__content}>
        {filteredTasks.length > 0 && (
          <div className={styles.taskList__tableWrapper}>
            <table className={styles.taskList__table}>
              <colgroup>
                <col style={{ width: '100px' }} />
                <col style={{ width: '220px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '80px' }} />
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
            <div>
              <img src={noData} alt="no tasks" />
              <h2>No tasks for now — keep up the great work!</h2>
            </div>
          </div>
        )}

        {filteredTasks.length > 0 && (
          <div className={styles.taskList__cardWrapper}>
            {currentTasks.map((task) => (
              <TaskMobile key={task._id} task={task} />
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
  )
}

export default TaskList
