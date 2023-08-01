import React from 'react'
import logo from "../assets/images/teamlogo.png"
import Api from '../Api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faHouse, faListCheck, faClipboard } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


const WorkSpace = () => {
    //get token from local storage and decode it
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const [user, setUser] = useState([]);
    const history = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const response = await Api.get(`/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.data;

            setUser(data);
        } catch (error) {
            history('/login');
        }
    };

    return (
        <div>
            <div>
                <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between p-4">
                        <a href="/" className="flex items-center">
                            <img src={logo} className="h-8 mr-3" alt="Team M Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Team Management</span>
                        </a>
                        <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                            <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                                <li>
                                    <a href="#" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page"><FontAwesomeIcon icon={faBell} /></a>

                                </li>
                                <li>
                                    <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Welcome, {user.firstName}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

            </div>
            <div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="... sideContents p-4">
                        <div className='mainMenu pb-3'>
                            <a href="#">
                                <div className='hover:bg-blue-300 pb-2'>
                                    <FontAwesomeIcon icon={faHouse} style={{ color: "#54bb5a", }} className='pr-2' />
                                    My Home
                                </div>
                            </a>
                            <a href="#">
                                <div className='hover:bg-blue-300'>
                                    <FontAwesomeIcon icon={faListCheck} style={{ color: "orange" }} className='pr-2' />
                                    My Tasks
                                </div>
                            </a>
                        </div>
                        <hr />
                        <div>
                            <div className='text-center p-3'>
                                <FontAwesomeIcon icon={faClipboard} style={{ color: "#e16684", }} className='pr-2' />
                                <a href="#">Your Projects</a>
                            </div>
                            <div>

                                <form className="flex items-center">
                                    <label htmlFor="simple-search" class="sr-only">Search</label>
                                    <div className="relative w-full">
                                        <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Projects ..." required />
                                    </div>
                                    <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 ...">
                        <h1>Your Work Space</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkSpace
