import React from 'react'
import * as styles from './Loader.module.scss'

const Loader = () => {
  return (
    <div className={styles.loader__container}>
      <div className={styles.loader}></div>
    </div>
  )
}

export default Loader
