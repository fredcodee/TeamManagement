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



function App() {
  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route element = {<PrivateRoute> <WorkSpace /></PrivateRoute>} path = "/user-workspace" />
          <Route element = {<PrivateRoute> <Tasks /></PrivateRoute>} path = "/user-tasks" /> 
          <Route element = {<PrivateRoute> <UserManagement /></PrivateRoute>} path = "/user-management" />
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
