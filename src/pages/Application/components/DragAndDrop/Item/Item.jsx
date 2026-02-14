import React from 'react'
import { RxDragHandleHorizontal } from 'react-icons/rx'
import * as styles from './Item.module.scss'

const Item = ({ task }) => {
  return (
    <div className={styles.item}>
      <p className={styles.item__text}>{task}</p>
      <button className={styles.item__button}>
        <RxDragHandleHorizontal />
      </button>
    </div>
  )
}

export default Item
