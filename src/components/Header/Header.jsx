import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { home, notification, stats, sun, moon, exit } from '../../assets'
import * as styles from './Header.module.scss'
import useTheme from '../../hooks/useTheme'

// Test plug
// const Link = ({ children }) => <>{children}</>

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  const modalOpenHandler = () => setIsModalOpen(!isModalOpen)
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

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

          <li>
            <div className={styles.header__icon_wrapper}>
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

          <li>
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
    </header>
  )
}

export default Header
