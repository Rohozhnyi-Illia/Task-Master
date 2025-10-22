import React, { Suspense, lazy } from 'react'
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

function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/update-password" element={<UpdatePassword />} />

            <Route
              element={
                <ProtectedPath>
                  <HeaderLayout />
                </ProtectedPath>
              }
            >
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/application" element={<Application />} />
            </Route>
          </Routes>
        </Router>
      </Suspense>
    </Provider>
  )
}

export default App
