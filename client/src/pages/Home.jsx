import React from 'react'
import logo from "../assets/images/teamlogo.png"
import "../assets/styles/homepage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faCode, faPeopleGroup, faMagnifyingGlassChart, faDiagramProject, faListCheck} from '@fortawesome/free-solid-svg-icons'

const Home = () => {
    return (
        <div>
            <div >
                <nav class="bg-white border-gray-200 dark:bg-gray-900">
                    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <a href="https://flowbite.com/" class="flex items-center">
                            <img src={logo} className="h-8 mr-3" alt="Team M Logo" />
                            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Team Management</span>
                        </a>
                        <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                            <span class="sr-only">Open main menu</span>
                            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                        <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

                                <li>
                                    <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
                                </li>
                                <li>
                                    <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Services</a>
                                </li>
                                <li>
                                    <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</a>
                                </li>
                                <li>
                                    <a href='#' class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Get Started</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

            </div>
            <div className='container mx-auto' id='section2'>
                <div className='text-center'>
                    <h1 className='font-bold text-5xl'>A platform built for a new way of working</h1>
                    <p className='text-2xl'>What would you like to manage with Team Management Work ?</p>
                </div>
                <div className='options pt-8'>
                    <div className='flex flex-wrap items-center justify-between p-4'>
                        <div className='options-list'>
                            <div className='section2_icons'>
                                <FontAwesomeIcon icon={faWandMagicSparkles} style={{ color: "#ff33da", }} />
                            </div>
                            <div>
                                Creative & design
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                            <FontAwesomeIcon icon={faCode} style={{color: "#48c767",}} />
                            </div>
                            <div>
                                Software Development
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                            <FontAwesomeIcon icon={faMagnifyingGlassChart} style={{color: "#3da5f5",}} />
                            </div>
                            <div>
                                Marketing
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                            <FontAwesomeIcon icon={faDiagramProject} style={{color: "#ffc038",}} />
                            </div>
                            <div>
                                Project Management
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                            <FontAwesomeIcon icon={faListCheck} style={{color: "#ff5e4d",}} />
                            </div>
                            <div>
                                Task Management
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                        <FontAwesomeIcon icon={faPeopleGroup} style={{color: "#ffb347",}} />
                        </div>
                            <div>
                                Team Operations
                            </div></div>
                    </div>

                </div>
                <div className='p-11 text-center'>
                    <a href='#' type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get Started</a>
                    <p className='text-sm'>No credit card needed or payment   ✦   Unlimited time / Free plan</p>
                </div>
            </div>
        </div>
    )
}

export default Home
