import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useState, useEffect } from 'react'
import PrivateRoute from './context/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkSpace from './pages/WorkSpace';
import Tasks from './pages/Tasks';
import UserManagement from './pages/UserManagement';
import ProjectManagement from './pages/ProjectManagement';
import ProjectPageAdmin from './pages/ProjectPageAdmin';
import JoinInvitedUsers from './pages/JoinInvitedUsers';
import ErrorPage from './pages/ErrorPage';
import TeamSettings from './pages/TeamSettings';
import ProjectPage from './pages/ProjectPage';
import TicketPage from './pages/TicketPage';
import socket from './Socket'
import '../src/assets/styles/alerts.css'
import NavBar from './components/NavBar';


function App() {
  const [user, setUser] = useState(() =>
  JSON.parse(localStorage.getItem('user')) || false);
  const token = localStorage.getItem('authTokens') || false
  const [currentUser , setCurrentUser] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notification, setNotification] = useState([])
  const [isAlertActive, setIsAlertActive] = useState(false);

  useEffect(() => {
  
    socket.on('Notification', (data) => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.id;
      if (data.userId === userId) {
        setNotification(data)
        showAlert()
      }
    });

    return () => {
      // Clean up socket event listener when component unmounts
      socket.off('Notification');
    };
    
  }, []);

  const showAlert = () => {
    setIsAlertActive(true);
  }

  const closeAlert = () => {
    setIsAlertActive(false);
  }


const getNotification = async()=>{
  const response = await Api.get('/api/user/notifications/all',{
      headers:{
          Authorization:token.replace(/"/g, '')
      }
  })

  const data = await response.data
  setNotifications(data)
  console.log(data)
}

  return (
    <>
      < NavBar user={user} />
      {isAlertActive && (
      <div className="alert_wrapper active">
        <div className="alert_backdrop"></div>
        <div className="alert_inner">
          <div className="alert_item alert_info">
            <div className="icon data_icon">
              <i className="fa-solid fa-bell pr-3"></i>
            </div>
            <div className="data">
              {notification.link !== null ?(
                <a href={notification.link} className='hover:text-gray-500'>{notification.notification}</a>
              ):(
                <p className="title"><span>Info: </span>
                {notification.notification}
              </p>
              )}
              
            </div>
            <div className="icon close" onClick={closeAlert}>
              <i className="fas fa-times pl-3 hover:cursor-pointer hover:text-orange-500"></i>
            </div>
          </div>
        </div>
      </div>
      )}
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route element={<JoinInvitedUsers />} path="/join/:id" />
            <Route element={<PrivateRoute> <WorkSpace /></PrivateRoute>} path="/user-workspace" />
            <Route element={<PrivateRoute> <Tasks /></PrivateRoute>} path="/user-tasks" />
            <Route element={<PrivateRoute> <UserManagement /></PrivateRoute>} path="/user-management" />
            <Route element={<PrivateRoute> <ProjectManagement /></PrivateRoute>} path="/project-management" />
            <Route element={<PrivateRoute> <ProjectPageAdmin /></PrivateRoute>} path="/project-page-admin/:id" />
            <Route element={<PrivateRoute> <TeamSettings /></PrivateRoute>} path="/team-settings" />
            <Route element={<PrivateRoute> <ProjectPage /></PrivateRoute>} path="/project-page/:id" />
            <Route element={<PrivateRoute> <TicketPage /></PrivateRoute>} path="/ticket/:id" />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
