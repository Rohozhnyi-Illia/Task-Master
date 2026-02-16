import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { clearSuccess } from '@store/UI/toastSlice'
import { FaCheckCircle } from 'react-icons/fa'
import * as styles from './Toast.module.scss'

const Toast = ({ id, message }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => dispatch(clearSuccess(id)), 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [id, dispatch])

  if (!message) return null

  return (
    <div className={`${styles.toast} ${visible ? styles.show : ''}`}>
      <p className={styles.toast__text}>{message}</p>
      <FaCheckCircle className={styles.toast__icon} />
    </div>
  )
}

export default Toast
