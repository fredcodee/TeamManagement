import React from 'react'
import Api from '../Api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faListCheck, faClipboard, faUsers, faDiagramProject, faSitemap } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SideMenuProjectList from '../components/SideMenuProjectList'
import PopUp from '../components/PopUp';


const WorkSpace = () => {
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
    const [showPopUp, setShowPopUp] = useState(false); //for new team
    const [teamName, setTeamName] = useState(''); //for new team


    useEffect(() => {
        getUser(),
            getProjects(),
            getTickets(),
            getTeamInfo()
    }, []);

    useEffect(() => {
        if (team.length > 0) {
        countMembersFunc(),
            adminCheckFunc()}
    }, [team]);


    const togglePopup = () => {
        setShowPopUp(!showPopUp);
    }


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
        e.preventDefault();
        const filteredProjects = projectcopy.filter((project) =>
            project.name.includes(search)
        );
        setProjects(filteredProjects);
    }

    const getTickets = async () => {
        const response = await Api.get('/api/user/project/ticket/assigned/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.data;
        data.splice(5)
        setTickets(data);
    }

    const getTeamInfo = async () => {
        const response = await Api.get('/api/user/team/info',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        const data = await response.data;
        setTeam(data);
    }

    const countMembersFunc = async () => {
        const teamId = {
            teamId: team[0]?.teamId
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

    const adminCheckFunc = async () => {

        const data = {
            teamId: team[0]?.teamId,
            userId: user._id
        }
        const response = await Api.post("/api/admin/check-admin", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data2 = await response.data;
        setAdminCheck(data2);

    }

    const createTeam = async () => {
        try {
            const response = await Api.post('/api/user/new/team', { teamName: teamName }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            await response.data;
            window.location.reload();
        } catch (error) {
            setError("sorry try another name or try again later");
            togglePopup();
        }
    }



    return (
        <div>
            
            {/* for popup for create team */}
            {showPopUp && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Create A Team
                                    </h3>
                                    <button type="button" onClick={togglePopup} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex flex-col">
                                        <label htmlFor="team-name" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Team Name
                                        </label>
                                        <div className="relative flex-1">
                                            <input type="text" id="team-name" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm" placeholder="Team Name" onChange={e => setTeamName(e.target.value)} />
                                        </div>
                                    </div>

                                </div>
                                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <button type="button" onClick={createTeam} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}

            {/* contents */}
            {error && <div className='text-center text-red-500' >{error}</div>}
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
                            <a href="/user-tasks">
                                <div className='hover:bg-blue-300 pb-2'>
                                    <FontAwesomeIcon icon={faListCheck} style={{ color: "orange" }} className='pr-2' />
                                    My Tasks
                                </div>
                            </a>
                            {adminCheck ? (
                                <div>
                                    <a href="/user-management">
                                        <div className='hover:bg-blue-300 pb-2'>
                                            <FontAwesomeIcon icon={faUsers} style={{ color: "#867bdb", }} className='pr-2' />
                                            User Management
                                        </div>
                                    </a>
                                    <a href="/project-management">
                                        <div className='hover:bg-blue-300 pb-2'>
                                            <FontAwesomeIcon icon={faDiagramProject} style={{ color: "#df5dc3", }} className='pr-2' />
                                            Project Management
                                        </div>
                                    </a>
                                    <a href="/team-settings">
                                        <div className='hover:bg-blue-300'>
                                            <FontAwesomeIcon icon={faSitemap} style={{ color: "#d2da5d", }} className='pr-2' />
                                            Team Management/Settings
                                        </div>
                                    </a>
                                </div>
                            ) : (null)}
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
                                        <div className='border-solid border-2 border-gray-300 p-2 rounded-lg' key={index}>
                                            <div className='text-center'>
                                                <h2>Team :  <span className='text-green-800'>{team.teamName}</span></h2>
                                                <h2>Role: <span className='text-blue-800'>{team.role}</span></h2>
                                                <h2><span>{countMembers}</span> members</h2>
                                            </div>
                                        </div>))
                                ) : (
                                    <div className='text-center'>
                                        <p>You are not in any team</p>
                                        <button type="button" onClick={togglePopup} className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Create a Team and get started</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='pt-4'>
                            <div className='text-center font-bold p-4'>
                                <h2>Your Tickets</h2>
                            </div>
                            <div className='border-solid border-2 border-gray-300 p-2 rounded-lg'>
                                {tickets.length > 0 ? (
                                    tickets.map((ticket, index) => (
                                        <div className='hover:bg-gray-300 pl-2' key={index}>
                                            <a href={`/ticket/${ticket._id}`}>{ticket.title} <span className='text-red-600'>- Ticket deadline on {new Date(ticket.deadLine).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</span></a>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-center'>
                                        <p>You have no tickets...</p>
                                    </div>
                                )}
                                <div className='text-center text-blue-700 hover:text-orange-400'>
                                    <a href="/user-tasks"> see all ...</a>
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
