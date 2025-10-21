import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectPath = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.isAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      navigate('/login', { replace: true })
    }
  }, [isAuth, navigate])

  return children ? <>{children}</> : <Outlet />
}

export default ProtectPath
