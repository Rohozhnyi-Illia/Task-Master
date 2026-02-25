import React from 'react'
import { useSelector } from 'react-redux'
import ReactDOM from 'react-dom'
import styles from './ToastsContainer.module.scss'
import Toast from '../Toast/Toast'

const ToastsContainer = () => {
  const toasts = useSelector((state) => state.success.items)

  if (!toasts.length) return null

  return ReactDOM.createPortal(
    <div className={styles.toasts__container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body,
  )
}

export default ToastsContainer
