import React from 'react'
import * as styles from './Application.module.scss'
import { search, addTask } from '../../assets'
import CustomSelect from './components/CustomSelect/CustomSelect'

const Application = () => {
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
            />
            <img src={search} alt="search" className={styles.application__search_icon} />
          </div>

          <div className={styles.application__categories}>
            <CustomSelect
              label="Categories"
              options={['High', 'Middle', 'Low']}
              onChange={(val) => console.log('Selected:', val)}
            />
          </div>

          <button type="button" className={styles.application__newTaskBtn}>
            New Task
            <img src={addTask} alt="add task" />
          </button>
        </header>
      </div>
    </div>
  )
}

export default Application
