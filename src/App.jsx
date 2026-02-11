import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProtectedPath from './services/ProtectedPath'
import { GlobalLoader, GlobalErrorModal, ToastsContainer, SuspenseLoader } from './components'
import useTheme from './hooks/useTheme'

const Login = lazy(() => import('./pages/Auth/Login'))
const UpdatePassword = lazy(() => import('./pages/Auth/UpdatePassword'))
const SignUp = lazy(() => import('./pages/Auth/SignUp'))
const Statistics = lazy(() => import('./pages/Statistics/StatsPage'))
const HeaderLayout = lazy(() => import('./layout/HeaderLayout'))
const Application = lazy(() => import('./pages/Application/Application'))
const VerifyPassword = lazy(() => import('./pages/Auth/VerifyPassword'))
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail'))
const Notifications = lazy(() => import('./pages/Notifications/NotificationsPage'))

function App() {
  useTheme()

  useEffect(() => {
    const fetchPingServer = async () => {
      await fetch('https://taskmaster-backend-e940.onrender.com/ping')
    }

    fetchPingServer()
  }, [])

  useEffect(() => {
    const setAppHeight = () => {
      const viewHeight = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--app-height', `${viewHeight * 100}px`)
    }

    setAppHeight()
    window.addEventListener('resize', setAppHeight)

    return () => window.removeEventListener('resize', setAppHeight)
  }, [])

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/verify-password" element={<VerifyPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route
            element={
              <ProtectedPath>
                <HeaderLayout />
              </ProtectedPath>
            }
          >
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/application" element={<Application />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
        <GlobalErrorModal />
        <ToastsContainer />
        <GlobalLoader />
      </Router>
    </Suspense>
  )
}

export default App
