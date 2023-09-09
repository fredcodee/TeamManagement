import React from 'react'
import logo from "../assets/images/teamlogo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCircle } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect} from 'react'
import '../assets/styles/notifications.css'
import Api from '../Api'

const NavBar = ({ user}) => {
    const token = localStorage.getItem('authTokens') || false
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false);
    const [isBellRed, setIsBellRed] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        getNotifications()
    }; 

    useEffect(()=>{
        getNotifications()
    },[])

    useEffect(() => {
        if(notifications > 0){
        const hasUnreadNotifications = notifications.some(notification => !notification.read);
        setIsBellRed(hasUnreadNotifications);}
    }, [notifications]);

    const getNotifications = async()=>{
        if(token){
            const response = await Api.get('/api/user/notifications/all',{
                headers:{
                    Authorization:token.replace(/"/g, '')
                }
            })
        
            const data = await response.data
            setNotifications(data)
        }
      }
    

    //logout and delete tokens in local storage
    const handleLogout = () => {
        localStorage.removeItem('authTokens')
        localStorage.removeItem('user')
        window.location.reload()
    }
    return (
        user ? (
            <div>
                <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between p-4">
                        <a href="/user-workspace" className="flex items-center">
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
                                    <a href="#" className={`block py-2 pl-3 pr-4 bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent`}>
                                        <FontAwesomeIcon icon={faBell} onClick={toggleNotifications} className={`${isBellRed ? 'text-red-400' : 'text-blue-600'}`} />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Welcome, {user.firstName}</a>
                                </li>
                                <li className='text-red-400 hover:text-red-700'>
                                    <a href="#" onClick={handleLogout}>Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav >
                {showNotifications && (
                    <div className="notification-dropdown">
                        <ul>
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    notification.read ?(
                                        notification.link !== null?(
                                            <a key={index} href={notification.link} className='text-gray-500'><li>{notification.notification}</li></a>
                                        ):(
                                            <li key={index} className='hover:cursor-auto text-gray-500'>{notification.notification}</li>
                                        )
                                    ):(
                                        notification.link !== null?(
                                            <a key={index} href={notification.link} className='text-blue-900'><li>{notification.notification} <span><FontAwesomeIcon icon={faCircle} style={{color: "#25519d", fontSize:'10px'}} /></span></li></a>
                                        ):(
                                            <li key={index} className='hover:cursor-auto text-blue-900'>{notification.notification} <span><FontAwesomeIcon icon={faCircle} style={{color: "#25519d",}} /></span></li>
                                        )
                                    )
                                ))
                            ) : (
                                <li className='text-gray-500'>No notifications</li>
                            )}
                        </ul>
                    </div>
                )}
            </div >
        ):(
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <a href="/" className="flex items-center">
                            <img src={logo} className="h-8 mr-3" alt="Team M Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Team Management</span>
                        </a>
                        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

                                <li>
                                    <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Services</a>
                                </li>
                                <li>
                                    <a href="/login" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</a>
                                </li>
                                <li>
                                    <a href='/register' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Get Started</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
        )  
    )
}

export default NavBar
