import React, { useEffect } from 'react'
import Item from '../Item/Item'
import * as styles from './Container.module.scss'
import { useSelector } from 'react-redux'

const Container = ({ isDragAndDropOpen, openDropAndDownHandler }) => {
  const tasks = useSelector((state) => state.tasks)

  useEffect(() => {
    if (!isDragAndDropOpen) return

    const keyDownHandler = (e) => {
      if (e.key === 'Escape') {
        openDropAndDownHandler()
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [isDragAndDropOpen, openDropAndDownHandler])

  if (!isDragAndDropOpen) return null

  return (
    <div
      className={`${styles.container} ${isDragAndDropOpen ? styles.show : styles.hide}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          openDropAndDownHandler()
        }
      }}
    >
      <div className={styles.container__content}>
        {tasks.map((task) => (
          <Item key={task._id} task={task.task} />
        ))}
      </div>
    </div>
  )
}

export default Container
