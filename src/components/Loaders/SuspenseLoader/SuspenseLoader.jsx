import React from 'react'
import { createPortal } from 'react-dom'
import * as styles from './SuspenseLoader.module.scss'

const Loader = () => {
  return createPortal(
    <div className={styles.loader__container}>
      <div className={styles.loader}></div>
    </div>,
    document.body,
  )
}

export default Loader
