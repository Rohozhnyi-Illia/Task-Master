import React, { useState, useEffect } from 'react'
import * as styles from './TaskList.module.scss'
import { noData, back, next } from '@assets'
import Task from '../Task/Task'
import TaskMobile from '../TaskMobile/TaskMobile'
import { useSelector } from 'react-redux'

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

  const nextHandler = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const backHandler = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

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
        <div className={styles.pagination}>
          <div className={styles.pagination__back}>
            <button onClick={backHandler} disabled={currentPage === 1}>
              <img src={back} alt="back" />
            </button>
          </div>

          <div className={styles.pagination__pages}>
            {pageNumbers.map((num) => (
              <div
                key={num}
                className={`${styles.pagination__pageNumber} ${
                  num === currentPage ? styles.active : ''
                }`}
                onClick={() => setCurrentPage(num)}
              >
                <p>{num}</p>
              </div>
            ))}
          </div>

          <div className={styles.pagination__next}>
            <button onClick={nextHandler} disabled={currentPage >= totalPages}>
              <img src={next} alt="next" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList
