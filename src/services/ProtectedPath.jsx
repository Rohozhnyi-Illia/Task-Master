import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { setAuth } from '../store/authSlice'
import { Loader } from '../components'

const ProtectPath = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const isAuth = useSelector((state) => state.auth.isAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      const savedAuth = localStorage.getItem('authState')
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth)
        if (parsed.isAuth) {
          dispatch(setAuth(parsed))
        }
      }
    }
    setLoading(false)
  }, [dispatch, isAuth])

  useEffect(() => {
    if (!loading && !isAuth) {
      navigate('/login', { replace: true })
    }
  }, [loading, isAuth, navigate])

  if (loading) return <Loader />

  return children ? <>{children}</> : <Outlet />
}

export default ProtectPath
