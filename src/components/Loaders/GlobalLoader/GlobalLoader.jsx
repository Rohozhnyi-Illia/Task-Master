import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import * as styles from './GlobalLoader.module.scss'
import { useSelector } from 'react-redux'

const GlobalLoader = () => {
  const isLoaderShown = useSelector((state) => state.loader.isLoaderShown)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isLoaderShown) {
      setVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      const timer = setTimeout(() => {
        setVisible(false)
        document.body.style.overflow = ''
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isLoaderShown])

  if (!visible) return null

  return createPortal(
    <div
      className={`${styles.loader__container} ${isLoaderShown ? styles.show : styles.hide}`}
    >
      <div className={styles.loader}></div>
    </div>,
    document.body,
  )
}

export default GlobalLoader
