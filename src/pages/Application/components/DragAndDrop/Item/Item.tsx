import React from 'react'
import { RxDragHandleHorizontal } from 'react-icons/rx'
import styles from './Item.module.scss'

interface ItemProps {
  task: string
}

const Item = ({ task }: ItemProps) => {
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
