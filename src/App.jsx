import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import UpdatePassword from './pages/Auth/UpdatePassword'
import Application from './pages/Application/Application'
import Statistics from './pages/Statistics/StatsPage'
import HeaderLayout from './layout/HeaderLayout'
import { Provider } from 'react-redux'
import store from './store/store'
import ProtectedPath from './services/ProtectedPath'

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default App
