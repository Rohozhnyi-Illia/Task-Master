import React, { useEffect, useState } from 'react'
import * as styles from './Application.module.scss'
import { search } from '../../assets'
import CategorySelect from './components/CategorySelect/CategorySelect'
import AddButton from './components/AddButton/AddButton'
import TaskList from './components/TaskList/TaskList/TaskList'
import AddModal from './components/AddModal/AddModal'
import { Loader, ErrorModal } from '@components'
import TaskService from '../../services/taskService'
import { useDispatch, useSelector } from 'react-redux'
import { getTasks } from '../../store/tasksSlice'

const Application = () => {
  const [selected, setSelected] = useState('')
  const [keywordValue, setKeyWordValue] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const keywordValueHandler = (e) => {
    setKeyWordValue(e.target.value)
  }

  const openModalHandler = () => setIsAddModalOpen(!isAddModalOpen)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await TaskService.getAllTasks()
        dispatch(getTasks(res))
      } catch (err) {
        console.error(err)
      }
    }
    fetchTasks()
  }, [dispatch])

  return (
    <div className={styles.application}>
      <div className="container">
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
              options={['All', 'High', 'Middle', 'Low']}
              onChange={(val) => console.log('Selected:', val)}
              selected={selected}
              setSelected={setSelected}
            />
          </div>

          <AddButton className={styles.application__newTaskBtn} onClick={openModalHandler} />
        </header>

        <TaskList keyword={keywordValue} selected={selected} />
      </div>

      {isAddModalOpen && <AddModal openModalHandler={openModalHandler} />}
      {fetchError && <ErrorModal error={fetchError} onClick={() => setFetchError('')} />}
      {isLoading && <Loader />}
    </div>
  )
}

export default Application
