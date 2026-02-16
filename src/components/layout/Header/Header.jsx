import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { home, notification, stats, sun } from '@assets'
import { moon, exit } from '@assets'
import * as styles from './Header.module.scss'
import useTheme from '../../../hooks/useTheme'
import { logout } from '@store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import AuthService from '@services/authService'
import NotificationService from '@services/notificationService'
import { getNotifications, deleteAllNotifications } from '@store/notificationSlice'
import { showError } from '@store/UI/errorSlice'
import { showLoader, closeLoader } from '@store/UI/loaderSlice'
import { resetFirstAppLoadDone } from '@store/appSlice'
import { resetTasks } from '@store/tasksSlice'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const notificationsList = useSelector((state) => state.notification) || []
  const isLoaderShown = useSelector((state) => state.loader.isLoaderShown)

  const headerRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const modalOpenHandler = () => setIsModalOpen(!isModalOpen)
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  const logoutHandler = async () => {
    dispatch(showLoader())
    const res = await AuthService.logout()

    if (res.success) {
      dispatch(resetFirstAppLoadDone())
      dispatch(resetTasks())
      dispatch(deleteAllNotifications())
      dispatch(logout())

      navigate('/login', { replace: true })
    } else {
      dispatch(showError(res.error))
    }

    dispatch(closeLoader())
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await NotificationService.getUserNotifications()
      if (res.success) {
        dispatch(getNotifications(res.data))
      } else {
        dispatch(showError(res.error))
      }
    }

    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 15 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [dispatch])

  useEffect(() => {
    const setHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight
        document.documentElement.style.setProperty('--header-height', `${height}px`)
      }
    }

    setHeaderHeight()
    window.addEventListener('resize', setHeaderHeight)
    return () => window.removeEventListener('resize', setHeaderHeight)
  }, [])

  return (
    <header className={styles.header} ref={headerRef}>
      <div className="container">
        <div className={styles.header__wrapper}>
          <h2 className={styles.header__title}>TaskMaster</h2>

          <nav
            className={`${styles.header__nav} ${isModalOpen ? styles.header__nav_open : ''}`}
          >
            <ul className={styles.header__list}>
              <li>
                <Link
                  to={'/application'}
                  className={styles.header__icon_wrapper}
                  onClick={() => modalOpenHandler()}
                >
                  <img src={home} alt="home" className={styles.header__icon} />
                </Link>
              </li>

              <li className={styles.header__notification}>
                <Link
                  to={'/notifications'}
                  className={styles.header__icon_wrapper}
                  onClick={() => modalOpenHandler()}
                >
                  <img
                    src={notification}
                    alt="notifications"
                    className={styles.header__icon}
                  />
                  {notificationsList.length > 0 && (
                    <div className={styles.header__notification_quantity}>
                      <p>{notificationsList.length}</p>
                    </div>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to={'/statistics'}
                  className={styles.header__icon_wrapper}
                  onClick={() => modalOpenHandler()}
                >
                  <img src={stats} alt="stats" className={styles.header__icon} />
                </Link>
              </li>

              <li>
                <button
                  className={`${styles.themeToggle} ${isDark ? styles.dark : ''}`}
                  onClick={toggleTheme}
                  aria-pressed={isDark}
                >
                  <img src={sun} alt="sun" className={styles.themeToggle__icon_sun} />
                  <img src={moon} alt="moon" className={styles.themeToggle__icon_moon} />
                  <div className={styles.themeToggle__slider}></div>
                </button>
              </li>

              <li>
                <button
                  className={styles.header__icon_wrapper}
                  disabled={isLoaderShown}
                  onClick={!isLoaderShown ? logoutHandler : undefined}
                >
                  <img src={exit} alt="logout" className={styles.header__icon} />
                </button>
              </li>
            </ul>
          </nav>

          <div
            className={`${styles.header__burger} ${
              isModalOpen ? styles.header__burger_open : ''
            }`}
            onClick={modalOpenHandler}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
