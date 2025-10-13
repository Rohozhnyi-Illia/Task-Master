import React from 'react'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import UpdatePassword from './pages/Auth/UpdatePassword'
import Application from './pages/Application/Application'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/application" element={<Application />} />
      </Routes>
    </Router>
  )
}

export default App
