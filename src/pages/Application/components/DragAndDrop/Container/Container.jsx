import React, { useEffect } from 'react'
import Item from '../Item/Item'
import * as styles from './Container.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskService from '@services/taskService'
import { updateTaskOrder, getTasks } from '@store/tasksSlice'
import { showError } from '@store/UI/errorSlice'
import { showSuccess } from '@store/UI/toastSlice'

const Container = ({ isDragAndDropOpen, openDropAndDownHandler }) => {
  const tasks = useSelector((state) => state.tasks)
  const dispatch = useDispatch()

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

  useEffect(() => {
    if (isDragAndDropOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isDragAndDropOpen])

  if (!isDragAndDropOpen) return null

  const onDragEnd = async (result) => {
    if (!result.destination) return

    const newTasks = Array.from(tasks)
    const [movedTask] = newTasks.splice(result.source.index, 1)
    newTasks.splice(result.destination.index, 0, movedTask)

    dispatch(updateTaskOrder(newTasks))

    try {
      const orderedIds = newTasks.map((task) => task._id)
      const response = await TaskService.reorderTasks(orderedIds)

      if (response.success) {
        dispatch(showSuccess('The order has been changed.'))
      }
    } catch (error) {
      dispatch(showError(error.message))
      dispatch(getTasks(tasks))
    }
  }

  return (
    <div
      className={`${styles.container} ${isDragAndDropOpen ? styles.show : styles.hide}`}
      onClick={(e) => e.target === e.currentTarget && openDropAndDownHandler()}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              className={styles.taskList}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        zIndex: snapshot.isDragging ? 9999 : 'auto',
                      }}
                    >
                      <Item task={task.task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default Container
