import React from 'react';
import {useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';
import ColImage from '../assets/images/registerImg.png'
import '../assets/styles/register.css'

const Register = () => {
  const { registerUser, error: contextError } = useContext(AuthContext);
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(firstname, lastname, email, password);
    } catch (err) {
      setError(err.message);
    }
  }


  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-auto max-w-full">
          <div className='text-center p-11'>
            <h1 className="text-4xl font-bold p-3">Welcome To TeamManagement</h1>
            <p>Get started - it's free.</p>
          </div>
          <hr />
          <div className='p-6'>
            <form onSubmit={handleSubmit}>
              <label htmlFor="firstname">First Name</label>
              <input id="firstname" type="text" name="firstname" />
              <input type="text" id="firstname" onChange={e => setFirstname(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
              <br />
              <label htmlFor="lastname">Last Name</label>
              <br />
              <input type="text" id="lastname" onChange={e => setLastname(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
              <br />
              <label htmlFor="email">Email</label>
              <input type="email" id="email" onChange={e => setEmail(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@company.com" required />
              <br />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" onChange={e => setPassword(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder='Enter at least 8 characters' required />
              <br />
              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
              </div>
              <div className='text-center'>
                <button type='submit' className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Continue</button>
              </div>
              <br />
              {error && <div className='text-center text-red-500'>{error}</div>}
              {contextError && <div className='text-center text-red-500'>{contextError}</div>}

            </form>
          </div>
          <div className='text-center'>
            <p>Already have an account? <span className='text-blue-900'><a href="/login">Log in</a></span></p>
          </div>

        </div>
        <div className="h-auto max-w-full">
          <img src={ColImage} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Register
