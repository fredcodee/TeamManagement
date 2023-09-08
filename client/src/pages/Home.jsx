import React from 'react'
import logo from "../assets/images/teamlogo.png"
import boardImg from "../assets/images/homepagescetion6_img1.jpg"
import "../assets/styles/homepage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faCode, faPeopleGroup, faMagnifyingGlassChart, faDiagramProject, faListCheck } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
    return (
        <div>
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
                                <FontAwesomeIcon icon={faCode} style={{ color: "#48c767", }} />
                            </div>
                            <div>
                                Software Development
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} style={{ color: "#3da5f5", }} />
                            </div>
                            <div>
                                Marketing
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                                <FontAwesomeIcon icon={faDiagramProject} style={{ color: "#ffc038", }} />
                            </div>
                            <div>
                                Project Management
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                                <FontAwesomeIcon icon={faListCheck} style={{ color: "#ff5e4d", }} />
                            </div>
                            <div>
                                Task Management
                            </div>
                        </div>
                        <div className='options-list'>
                            <div className='section2_icons'>
                                <FontAwesomeIcon icon={faPeopleGroup} style={{ color: "#ffb347", }} />
                            </div>
                            <div>
                                Team Operations
                            </div></div>
                    </div>

                </div>
                <div className='p-11 text-center'>
                    <a href='/register' type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get Started</a>
                    <p className='text-sm'>No credit card needed or payment   ✦   Unlimited time / Free plan</p>
                </div>
            </div>
            <div className='section3'>
                <img src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/NaamaGros/HP_tests/HP_asset_white_bg.png" alt="" />
            </div>
            <div className='container mx-auto section4'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className='h-auto max-w-full '>
                        <h2 className='font-bold text-3xl'>The Work OS that lets you
                            shape workflows, <br /> your way</h2>
                    </div>
                    <div className='h-auto max-w-full '>
                        <p className='text-lg pb-2'>Boost your team’s alignment, efficiency, and productivity <br /> by customizing any workflow to fit your needs.</p>
                        <a href='/register' className="text-white bg-pink-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get Started</a>
                    </div>
                </div>
            </div>
            <div className='section5 p-5'>
                <div className='container mx-auto'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className='h-auto max-w-full '>
                            <h2 className='font-bold text-3xl'>Streamline your work for maximum productivity</h2>
                            <p className='text-lg pt-4'>Centralize all your work, processes, tools, and files into one Work OS. Connect teams, bridge silos, and maintain one source of truth across your organization.</p>
                        </div>
                        <div className='h-auto max-w-full '>
                            <h2 className='font-bold text-3xl'>Bring teams together to
                                drive business impact</h2>
                            <p className='text-lg pt-4'>Collaborate effectively organization-wide to get a clear picture of all your work. Stay in the loop with easy-to-use automations and real-time notifications.</p>
                        </div>
                    </div>
                    <div className='h-auto max-w-full pt-11'>
                            <h2 className='font-bold text-3xl'>Stay on track to
                                reach your goals, faster</h2>
                            <p className='text-lg p-4'>Get a high-level overview of your organization with customizable dashboards. Make confident decisions and easily scale workflows for your evolving needs.</p>
                            <a href='/register' className="text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get Started</a>
                        </div>
                </div>
            </div>
            <div className='container mx-auto section6 text-center'>
                <div className='s1'>
                    <h1 className='font-bold text-5xl'>Everything you need for any workflow</h1>
                    <h3 className='text-lg p-2'>Easily build your ideal workflow with TeamManagement building blocks.</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className='h-auto max-w-full '>
                        <img src={boardImg} alt="" />
                    </div>
                    <div className='h-auto max-w-full'>
                        <h2 className='font-bold text-3xl text-purple-600' >Boards</h2>
                        <p>Everything starts with a visual board — the core of TeamManagement. Tailor it your way and manage anything from projects to departments.</p>
                        <h2 className='font-bold text-3xl pt-11 text-green-600'>End-to-end products to run the core of your business</h2>
                        <p>Tailored products designed for every aspect of your teams' needs.</p>
                    
                    </div>
                </div>

            </div>
            <hr />
            <div className='container mx-auto footer p-4'>
                <p>All Rights Reserved © created by <span className='text-red-800'><a href="https://thefredcode.com">Fredcode</a></span></p>
            </div>
        </div>
    )
}

export default Home
