import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components'

const HeaderLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default HeaderLayout
