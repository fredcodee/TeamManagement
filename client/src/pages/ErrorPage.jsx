import React from 'react'
import logo from "../assets/images/teamlogo.png"
import '../assets/styles/register.css'
import '../assets/styles/errorPage.css'



const ErrorPage = () => {
    return (
        <div>
            <div className='flex flex-wrap p-4 bg-gray-200'>
                <img src={logo} className="h-8 mr-3" alt="Team M Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Team Management</span>
            </div>

            <div className='text-center'>
                <div className='text-orange-600 pt-7 hover:text-blue-800'>
                    <a href="/">Go To Homepage</a>
                </div>
                <div id='content'>
                    <div id="main">
                        <div className="fof">
                            <h1>Error 404</h1>
                            <p>Sorry, Page not found</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ErrorPage
