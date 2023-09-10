import React from 'react'
import {useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';
import '../assets/styles/register.css'
import Api from '../Api';

const LoginDemoAccounts = () => {
    const { loginUser} = useContext(AuthContext);

    const loginDemo = async (account) => {
        try {
            const response = await Api.post('/api/get-demo-account-credentials', { accountName: account })
            const data = await response.data
            await loginUser(data.email, data.password);
        }
        catch (error) {
            setErrors(error.response.data.message)
        }
    }

  return (
    <div>
       <div>
          <div className='loginform'>
            <div className='text-center'>
              <h1 className="text-4xl p-3">Log in to a Demo Account</h1>
              <small>a Demo environment for view app functionalities</small>
            </div>
            
            <div className='text-center'>
                <div>
                <button className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=> loginDemo('admin') }>Log in as Admin</button>
                <button className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=> loginDemo('projectmanager') }>Log in as Project Manager</button>
                <button className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=> loginDemo('developer') }>Log in as Developer</button>
                <button className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=> loginDemo('member') }>Log in as Member</button>
                </div>

            <hr />
            <p>Or</p>
            <p className='pb-4'>Don't have an account yet? <span className='text-blue-900'><a href="/register">Sign up</a></span></p>
            <a href="/login" className='text-orange-800 hover:text-blue-700'>Go back to login page</a>
          </div>

          </div>

       </div>
    </div>
  )
}

export default LoginDemoAccounts
