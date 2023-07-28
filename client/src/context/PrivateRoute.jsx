import React from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const PrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext)
    
    if (!user){
        return <Navigate to ="/login" />    
    } 

  return children
}

export default PrivateRoute