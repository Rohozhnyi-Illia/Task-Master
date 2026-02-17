import React from 'react'
import { noData } from '@assets'
import * as styles from './NoData.module.scss'

const NoData = ({ text }) => {
  return (
    <div className={styles.empty}>
      <img src={noData} alt="no data" />
      <h2>{text}</h2>
    </div>
  )
}

export default NoData
