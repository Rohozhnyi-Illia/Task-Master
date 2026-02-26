import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { RootState } from '@store/store'

interface ProtectPathProps {
  children: React.ReactNode
}

const ProtectPath = ({ children }: ProtectPathProps) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      navigate('/login', { replace: true })
    }
  }, [isAuth, navigate])

  return children ? <>{children}</> : <Outlet />
}

export default ProtectPath
