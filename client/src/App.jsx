import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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


function App() {
  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/error" element={<ErrorPage/>}/>
          <Route element = {<JoinInvitedUsers />} path = "/join/:id" />
          <Route element = {<PrivateRoute> <WorkSpace /></PrivateRoute>} path = "/user-workspace" />
          <Route element = {<PrivateRoute> <Tasks /></PrivateRoute>} path = "/user-tasks" /> 
          <Route element = {<PrivateRoute> <UserManagement /></PrivateRoute>} path = "/user-management" />
          <Route element = {<PrivateRoute> <ProjectManagement /></PrivateRoute>} path = "/project-management" />
          <Route element = {<PrivateRoute> <ProjectPageAdmin /></PrivateRoute>} path = "/project-page-admin/:id" />
          <Route element = {<PrivateRoute> <TeamSettings /></PrivateRoute>} path = "/team-settings" />
          <Route element = {<PrivateRoute> <ProjectPage /></PrivateRoute>} path = "/project-page/:id" />
          <Route element = {<PrivateRoute> <TicketPage /></PrivateRoute>} path = "/ticket/:id" />
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
