import React from 'react'
import logo from "../assets/images/teamlogo.png"
import {useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';
import '../assets/styles/register.css'

const Login = () => {
  const { loginUser, error } = useContext(AuthContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(email, password);
  };

  return (
    <div>
       <div className='flex flex-wrap p-4 bg-gray-200'>
       <img src={logo} className="h-8 mr-3" alt="Team M Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Team Management</span>
       </div>
       <div>
          <div className='loginform'>
            <div className='text-center'>
              <h1 className="text-4xl p-3">Log in to your account</h1>
            </div>
            
            <div className='p-4'>
              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Enter your work email address</label>
                <input type="email" id="email" onChange={e => setEmail(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@company.com" required />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={e => setPassword(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                <br />
                <div className='text-center'>
                <button type='submit' className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log in</button>
              </div>
              <br />
              {error && <div className='text-center text-red-500'>{error}</div>}
              </form>
            </div>
            <div className='text-center'>
            <p>Don't have an account yet? <span className='text-blue-900'><a href="/register">Sign up</a></span></p>
          </div>

          </div>

       </div>
    </div>
  )
}

export default Login
