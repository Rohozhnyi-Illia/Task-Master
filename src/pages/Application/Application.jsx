import React, { useEffect, useRef, useState } from 'react'
import * as styles from './Application.module.scss'
import { search } from '@assets'
import CategorySelect from '@components/CategorySelect/CategorySelect'
import AddButton from './components/AddButton/AddButton'
import TaskList from './components/TaskList/TaskList/TaskList'
import AddModal from './components/AddModal/AddModal'
import TaskService from '@services/taskService'
import { useDispatch, useSelector } from 'react-redux'
import { getTasks } from '@store/tasksSlice'
import { showError } from '@store/UI/errorSlice'
import { showLoader, closeLoader } from '@store/UI/loaderSlice'
import { setFirstAppLoadDone } from '@store/appSlice'

const FILTER_OPTIONS = [
  'All',
  'High',
  'Middle',
  'Low',
  'Active',
  'Done',
  'InProgress',
  'Archived',
]

const Application = () => {
  const [selected, setSelected] = useState('')
  const [keywordValue, setKeyWordValue] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const firstAppLoadDone = useSelector((state) => state.app.firstAppLoadDone)

  const dispatch = useDispatch()

  const keywordValueHandler = (e) => setKeyWordValue(e.target.value)
  const openModalHandler = () => setIsAddModalOpen(!isAddModalOpen)
  const addButtonRef = useRef(null)

  useEffect(() => {
    const fetchTasks = async () => {
      if (!firstAppLoadDone) {
        dispatch(showLoader())
      }

      try {
        const res = await TaskService.getAllTasks()
        if (res.success) {
          dispatch(getTasks(res.data))
        } else {
          dispatch(showError(res.error))
        }
      } catch (error) {
        dispatch(showError(error.message || 'Something went wrong'))
      } finally {
        if (!firstAppLoadDone) {
          dispatch(setFirstAppLoadDone())
          dispatch(closeLoader())
        }
      }
    }

    fetchTasks()
  }, [dispatch])

  return (
    <div className={styles.application}>
      <div className="container">
        <div className={styles.application__wrapper}>
          <header className={styles.application__header}>
            <h3 className={styles.application__title}>Task List</h3>

            <div className={styles.application__search}>
              <input
                type="text"
                className={styles.application__search_input}
                placeholder="Keyword"
                onChange={keywordValueHandler}
                value={keywordValue}
              />
              <img src={search} alt="search" className={styles.application__search_icon} />
            </div>

            <div className={styles.application__categories}>
              <CategorySelect
                options={FILTER_OPTIONS}
                onChange={(val) => setSelected(val)}
                selected={selected}
                setSelected={setSelected}
              />
            </div>

            <AddButton
              className={styles.application__newTaskBtn}
              onClick={openModalHandler}
              ref={addButtonRef}
            />
          </header>

          <TaskList keyword={keywordValue} selected={selected} />
        </div>

        {isAddModalOpen && (
          <AddModal openModalHandler={openModalHandler} isAddModalOpen={isAddModalOpen} />
        )}
      </div>
    </div>
  )
}

export default Application
