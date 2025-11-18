import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import ProtectedPath from './services/ProtectedPath'
import { Loader } from './components'

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
  useEffect(() => {
    const fetchPingServer = async () => {
      await fetch('https://taskmaster-backend-e940.onrender.com/ping')
    }

    fetchPingServer()
  }, [])

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    }

    setAppHeight()
    window.addEventListener('resize', setAppHeight)

    return () => window.removeEventListener('resize', setAppHeight)
  }, [])

  return (
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
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
        </Router>
      </Suspense>
    </Provider>
  )
}

export default App
