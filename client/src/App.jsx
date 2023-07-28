import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkSpace from './pages/WorkSpace';


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
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
