import React from 'react'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import '../assets/styles/register.css'

const JoinInvitedUsers = () => {
    const { id } = useParams();
    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        checkInvitation()
    }, [])

    const checkInvitation = async () => {
        try {
            const response = await Api.get(`/api/invite/${id}`);
            const data = await response.data;
            if (data.message === 'Invalid') {
                navigate('/')
            }
            setUser(data);
        } catch (error) {
            navigate('/error')
        }
    }

    const handleSubmit = async (e) => {
        try {
            const data ={
                firstName,
                lastName,
                email: user.email,
                password,
            }
            e.preventDefault();
            await Api.post(`/api/signup/invite`, data);
            navigate('/login')
        } catch (error) {
            setError(error.response.data.message)
        }

    }

    return (
        <div>
            <div>
                <div className='loginform'>
                    <div className='text-center'>
                        <h1 className="text-4xl p-3">You were Invited to join a Team</h1>
                    </div>

                    <div className='p-4'>
                        <div className='p-4'>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" onChange={e => setFirstName(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="eg. Mike" required />
                                <br />
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" onChange={e => setLastName(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="eg. Spencer" required />
                                <br />
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" value={user.email ||''} readOnly className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@company.com" required />
                                <br />
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" onChange={e => setPassword(e.target.value)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                <br />
                                <div className='text-center'>
                                    <button type='submit' className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join Your Team</button>
                                </div>
                                <br />
                                {error && <div className='text-center text-red-500'>{error}</div>}
                            </form>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default JoinInvitedUsers
