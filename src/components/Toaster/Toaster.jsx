import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearSuccess } from '@store/successSlice'
import { FaCheckCircle } from 'react-icons/fa'
import * as styles from './Toaster.module.scss'

const GlobalSuccessModal = () => {
  const dispatch = useDispatch()
  const message = useSelector((state) => state.success.message)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => dispatch(clearSuccess()), 300)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [message, dispatch])

  if (!message) return null

  return ReactDOM.createPortal(
    <div className={`${styles.toaster} ${visible ? styles.show : ''}`}>
      <p className={styles.toaster__text}>{message}</p>
      <FaCheckCircle className={styles.toaster__icon} />
    </div>,
    document.body,
  )
}

export default GlobalSuccessModal
