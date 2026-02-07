import React, { useEffect, useState } from 'react'
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
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [message, dispatch])

  if (!message) return null

  return (
    <div className={`${styles.toaster} ${visible ? styles.show : ''}`}>
      <p className={styles.toaster__text}>{message}</p>
      <FaCheckCircle className={styles.toaster__icon} />
    </div>
  )
}

export default GlobalSuccessModal
