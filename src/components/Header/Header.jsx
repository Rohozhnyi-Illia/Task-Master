import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  home,
  notification,
  stats,
  sun,
  moon,
  exit,
  notificationLg,
  closeModal,
} from '../../assets'
import * as styles from './Header.module.scss'
import useTheme from '../../hooks/useTheme'
import Notification from '../../pages/Application/components/Notification/Notification'
import { logout } from '@store/authSlice'
import { useDispatch } from 'react-redux'
import AuthService from '@services/authService'
import { ErrorModal, Loader } from '@components'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notificationList, setIsNotificationList] = useState([])
  const [authError, setAuthError] = useState('')
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  const dispatch = useDispatch()

  const notificationOpenHandler = () => setIsNotificationOpen(!isNotificationOpen)
  const modalOpenHandler = () => {
    setIsModalOpen(!isModalOpen)
    if (isNotificationOpen) {
      notificationOpenHandler()
    }
  }
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  const logoutHandler = async () => {
    setAuthError('')
    setIsLoading(true)

    try {
      const res = await AuthService.logout()
      console.log(res)
      if (!res.success) {
        setAuthError(res.error || 'Something went wrong')
        return
      }
      dispatch(logout())
    } catch (error) {
      setAuthError(error.message || 'Network error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className={styles.header}>
      <h2 className={styles.header__title}>TaskMaster</h2>

      <nav className={`${styles.header__nav} ${isModalOpen ? styles.header__nav_open : ''}`}>
        <ul className={styles.header__list}>
          <li>
            <Link to={'/application'} className={styles.header__link}>
              <div className={styles.header__icon_wrapper}>
                <img src={home} alt="home" className={styles.header__icon} />
              </div>
            </Link>
          </li>

          <li className={styles.header__notification}>
            <div className={styles.header__icon_wrapper} onClick={notificationOpenHandler}>
              <img src={notification} alt="notifications" className={styles.header__icon} />
            </div>
          </li>

          <li>
            <Link to={'/statistics'} className={styles.header__link}>
              <div className={styles.header__icon_wrapper}>
                <img src={stats} alt="stats" className={styles.header__icon} />
              </div>
            </Link>
          </li>

          <li>
            <div
              data-testid="theme-toggle"
              className={`${styles.themeToggle} ${isDark ? styles.dark : ''}`}
              onClick={toggleTheme}
            >
              <img src={sun} alt="sun" className={styles.themeToggle__icon_sun} />
              <img src={moon} alt="moon" className={styles.themeToggle__icon_moon} />
              <div className={styles.themeToggle__slider}></div>
            </div>
          </li>

          <li onClick={!isLoading ? logoutHandler : undefined}>
            <div className={styles.header__icon_wrapper}>
              <img src={exit} alt="logout" className={styles.header__icon} />
            </div>
          </li>
        </ul>
      </nav>

      <div
        role="button"
        aria-label="menu toggle"
        className={`${styles.header__burger} ${isModalOpen ? styles.header__burger_open : ''}`}
        onClick={modalOpenHandler}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div
        className={`${styles.header__notificationList} ${
          isNotificationOpen ? styles.header__notificationList_open : ''
        }`}
      >
        <button
          type="button"
          className={styles.header__notificationList_button}
          onClick={notificationOpenHandler}
        >
          <img src={closeModal} alt="close button" />
        </button>

        {notificationList.length < 1 ? (
          <div className={styles.header__notificationList_empty}>
            <img
              src={notificationLg}
              alt="notification"
              className={styles.header__notificationList_img}
            />

            <p className={styles.header__notificationList_text}>
              You don't have any notifications yet
            </p>
          </div>
        ) : (
          <div className={styles.header__notificationList_notifications}>
            <Notification notification={notificationList} />
          </div>
        )}
      </div>

      {authError && <ErrorModal error={authError} onClick={() => setAuthError('')} />}
      {isLoading && <Loader />}
    </header>
  )
}

export default Header
