import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@components'
import * as styles from './HeaderLayout.module.scss'

const HeaderLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default HeaderLayout
