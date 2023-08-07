import React from 'react'
import logo from "../assets/images/teamlogo.png"
import Api from '../Api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faHouse, faListCheck, faClipboard,faUsers,faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SideMenuProjectList from '../components/SideMenuProjectList'


const WorkSpace = () => {
    //get token from local storage and decode it
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const [user, setUser] = useState([]);
    const history = useNavigate();
    const [projects, setProjects] = useState([]);
    const [projectcopy, setProjectcopy] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [team, setTeam] = useState([]);
    const [countMembers, setCountMembers] = useState(0);
    const [adminCheck, setAdminCheck] = useState(false);


    useEffect(() => {
        getUser(),
            getProjects(),
            getTickets(),
            getTeamInfo()
    }, []);

    useEffect(() => {
        countMembersFunc(),
            adminCheckFunc()
    }, [team]);




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

    const getProjects = async () => {
        try {
            const response = await Api.get('/api/user/projects', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.data;
            setProjects(data);
            setProjectcopy(data);
        }
        catch (error) {
            setError(error.response.data.message);
        }
    }

    const handleSearch = (e) => {
        try {
            e.preventDefault();
            const filteredProjects = projectcopy.filter((project) =>
                project.name.includes(search)
            );
            setProjects(filteredProjects);
        } catch (error) {
            console.log(error);
        }
    }

    const getTickets = async () => {
        try {
            const response = await Api.get('/api/user/project/ticket/assigned/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.data;
            setTickets(data);
        }
        catch (error) {
            setError(error);
        }
    }

    const getTeamInfo = async () => {
        try {
            const response = await Api.get('/api/user/team/info',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            const data = await response.data;
            setTeam(data);
        }
        catch (error) {
            setError(error);
        }
    }

    const countMembersFunc = async () => {
        try {
            const teamId = {
                teamId: team[0].teamId
            }
            const response = await Api.post("/api/user/team/count/members", teamId,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            const data = await response.data;
            setCountMembers(data);
        }
        catch (error) {
            setError(error);
        }
    }

    const adminCheckFunc = async () => {
        try {
            const data = {
                teamId: team[0].teamId,
                userId: user._id
            }
            const response = await Api.post("/api/admin/check-admin", data,{
                headers: {
                    Authorization: `Bearer ${token}`,
            }
            });
            const data2 = await response.data;
            setAdminCheck(data2);
        }
        catch (error) {
            setError(error);
        }
    }



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
                            <a href="/user-workspace">
                                <div className='hover:bg-blue-300 pb-2'>
                                    <FontAwesomeIcon icon={faHouse} style={{ color: "#54bb5a", }} className='pr-2' />
                                    My Home
                                </div>
                            </a>
                            <a href="#">
                                <div className='hover:bg-blue-300 pb-2'>
                                    <FontAwesomeIcon icon={faListCheck} style={{ color: "orange" }} className='pr-2' />
                                    My Tasks
                                </div>
                            </a>
                            {adminCheck? (
                                <div>
                                <a href="#">
                                <div className='hover:bg-blue-300 pb-2'>
                                    <FontAwesomeIcon icon={faUsers} style={{color: "#867bdb",}} className='pr-2' />
                                    User Management
                                </div>
                                </a>
                                <a href="#">
                                <div className='hover:bg-blue-300'>
                                    <FontAwesomeIcon icon={faDiagramProject} style={{color: "#df5dc3",}} className='pr-2' />
                                    Project Management
                                </div>
                                </a>
                                </div>
                            ):(null)}
                        </div>
                        <hr />
                        <div>
                            <div className='text-center p-3'>
                                <FontAwesomeIcon icon={faClipboard} style={{ color: "#e16684", }} className='pr-2' />
                                <a href="#">Your Projects</a>
                            </div>
                            <div>
                                <form className="flex items-center" onSubmit={handleSearch}>
                                    <label htmlFor="simple-search" className="sr-only">Search</label>
                                    <div className="relative w-full">
                                        <input type="text" id="simple-search" onChange={e => setSearch(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Projects ..." required />
                                    </div>
                                    <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </form>
                            </div>
                            <div>
                                <SideMenuProjectList projects={projects} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 ... mr-14">
                        <div>
                            <div className='text-center font-bold p-4'>
                                Your Team Information
                            </div>
                            <div>
                                {team.length > 0 ? (
                                    team.map((team, index) => (
                                        <div className='border-solid border-2 border-gray-300 p-2' key={index}>
                                            <div className='text-center'>
                                                <h2>Team :  <span className='text-green-800'>{team.teamName}</span></h2>
                                                <h2><span>{countMembers}</span> members</h2>
                                            </div>
                                        </div>))
                                ) : (
                                    <div className='text-center'>
                                        <p>You are not in any team</p>
                                        <a href="#" className=' text-blue-600'> Create a Team and get started</a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='pt-4'>
                            <div className='text-center font-bold p-4'>
                                <h2>Your Tickets</h2>
                            </div>
                            <div className='border-solid border-2 border-gray-300 p-2'>
                                {tickets.length > 0 ? (
                                    tickets.map((ticket, index) => (
                                        <div className='hover:bg-gray-300 pl-2' key={index}>
                                            <a href="#">{ticket.title} <span className='text-red-600'>- Ticket deadline on {new Date(ticket.deadLine).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</span></a>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-center'>
                                        <p>You have no tickets</p>
                                    </div>
                                )}
                                <div className='text-center text-blue-700 hover:text-orange-400'>
                                    <a href="#"> see all ...</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkSpace
