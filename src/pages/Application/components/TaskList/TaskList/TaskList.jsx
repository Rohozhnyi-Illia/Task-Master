import React, { useState, useEffect } from 'react'
import * as styles from './TaskList.module.scss'
import { noData, back, next } from '@assets'
import Task from '../Task/Task'
import TaskMobile from '../TaskMobile/TaskMobile'

const TaskList = ({ tasks = [], keyword, selected }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const taskPerPage = 10

  const filteredTasks = tasks.filter((task) => {
    const matchesKeyword = !keyword || task.name.toLowerCase().includes(keyword.toLowerCase())
    const matchesCategory = !selected || selected === 'All' || task.category === selected
    return matchesKeyword && matchesCategory
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
      {tasks.length > 0 && (
        <div className={styles.taskList__tableWrapper}>
          <table className={styles.taskList__table}>
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
              {currentTasks.map((task, index) => (
                <Task key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tasks.length < 1 && (
        <div className={styles.taskList__empty}>
          <div>
            <img src={noData} alt="no tasks" />
            <h2>No tasks for now — keep up the great work!</h2>
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div className={styles.taskList__cardWrapper}>
          {currentTasks.map((task, index) => (
            <TaskMobile key={index} task={task} />
          ))}
        </div>
      )}

      {tasks.length > 10 && (
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
