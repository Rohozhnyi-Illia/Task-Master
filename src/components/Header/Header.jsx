import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { home, notification, stats, sun } from '../../assets'
import { moon, exit, notificationLg, closeModal } from '../../assets'
import * as styles from './Header.module.scss'
import useTheme from '../../hooks/useTheme'
import Notification from '@pages/Application/components/Notification/Notification'
import { logout } from '@store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import AuthService from '@services/authService'
import { ErrorModal } from '@components'
import NotificationService from '../../services/notificationService'
import { getNotifications } from '../../store/notificationSlice'

const Header = () => {
  const notificationsList = useSelector((state) => state.notification) || []
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [fetchError, setFetchError] = useState('')
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
    setFetchError('')
    setIsLoading(true)

    try {
      const res = await AuthService.logout()

      if (!res.success) {
        setFetchError(res.error || 'Something went wrong')
        return
      }

      dispatch(logout())
    } catch (error) {
      setFetchError(error.message || 'Network error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let intervalId

    const fetchData = async () => {
      setFetchError('')

      try {
        const res = await NotificationService.getUserNotifications()

        if (!res.success) {
          setFetchError(res.error || 'Something went wrong')
          return
        }

        dispatch(getNotifications(res.data))
      } catch (error) {
        setFetchError(error.message || 'Something went wrong')
      }
    }

    fetchData()

    intervalId = setInterval(fetchData, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [dispatch])

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__wrapper}>
          <h2 className={styles.header__title}>TaskMaster</h2>

          <nav
            className={`${styles.header__nav} ${isModalOpen ? styles.header__nav_open : ''}`}
          >
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
                  <img
                    src={notification}
                    alt="notifications"
                    className={styles.header__icon}
                  />

                  {notificationsList.length > 0 && (
                    <div className={styles.header__notification_quantity}>
                      {notificationsList.length}
                    </div>
                  )}
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
            className={`${styles.header__burger} ${
              isModalOpen ? styles.header__burger_open : ''
            }`}
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

            {notificationsList.length === 0 ? (
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
                {notificationsList.map((item) => (
                  <Notification
                    key={item._id}
                    notification={item.message}
                    id={item._id}
                    isRead={item.isRead}
                  />
                ))}
              </div>
            )}
          </div>

          {fetchError && <ErrorModal error={fetchError} onClick={() => setFetchError('')} />}
        </div>
      </div>
    </header>
  )
}

export default Header
