import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwt_decode(localStorage.getItem('authTokens'))
      : null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await Api.post('/api/login', {
        email,
        password,
      });

      const data = await response.data;
      if (response.status === 200) {
        setAuthTokens(data.token);
        setUser(jwt_decode(data.token));
        localStorage.setItem('authTokens', JSON.stringify(data.token));
        history('/user-workspace');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };



  const registerUser = async (firstname, lastname, email, password) => {
    try {
      const data ={
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password
      }
      const response = await Api.post('/api/register', data);

      if (response.status === 201 || response.status === 200) {
        history('/login');
      } else {
        const data = await response.data;
        setError(data.message);
      }
    } catch (error) {
        setError(error.response.data.message);
    }
  };


  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    history('/');
  };

  const contextData = {
    user,
    error,
    loginUser,
    logoutUser,
    registerUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
