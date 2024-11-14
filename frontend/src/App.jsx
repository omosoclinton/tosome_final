import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './components/Login'
import NotFound from './pages/NotFound'
import Tutor from './pages/Tutor'
import RegisterAndLogOut from './components/RegisterAndLogout'
import ProtectedRoute from './components/ProtectedRoute'
import { ProfileContext, TutorProfileContext } from './components/Context'
import { AuthProvider } from './context/AuthContext'
import CreateSessionForm from './components/sessions/CreateSessionForm'
import Home from './pages/Home'
import Logout from './components/Logout'
import TutorAvailableSessions from './components/sessions/TutorAvailableSessions'
import TutorBookedSessions from './components/sessions/TutorBookedSessions'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route 
            path='/home'
            element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
          }/>
          <Route path='/tutor-available-sessions' element={<TutorAvailableSessions />} />
          <Route path='/tutor-booked-sessions' element={<TutorBookedSessions />} />
          <Route path='/create-session' element={<CreateSessionForm/>}/>
          <Route path='/tutor' element={<Tutor />} />
          <Route path='/login' element={<Logout />} />
          <Route path='/logout' element={<Login />} />
          <Route path='/register' element={<RegisterAndLogOut />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/' element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
