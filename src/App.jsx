import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import UpdatePassword from './pages/Auth/UpdatePassword'
import Application from './pages/Application/Application'
import Statistics from './pages/Statistics/StatsPage'
import HeaderLayout from './layout/HeaderLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route element={<HeaderLayout />}>
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/application" element={<Application />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
