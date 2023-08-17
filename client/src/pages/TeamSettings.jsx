import React from 'react'
import NavBar from '../components/NavBar'
import Api from '../Api'
import { useState, useEffect } from 'react'
import PopUp from '../components/PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons'

const TeamSettings = () => {
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const [user, setUser] = useState([]);
    const [team, setTeam] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [showPopUpForEditTeam, setShowPopUpForEditTeam] = useState(false);
    const [roleName, setRoleName] = useState('');


    useEffect(() => {
        getUser(),
            getTeamInfo()
    }, [])



    const togglePopUpForEditTeam = () => {
        setShowPopUpForEditTeam(!showPopUpForEditTeam);
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
    const getTeamInfo = async () => {
            const response = await Api.get('/api/user/team/info',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            const data = await response.data;
            setTeam(data);
            setTeamName(data[0]?.teamName);
        
    }

    const editTeam = async () => {
        try {
            const data = {
                teamId: team[0]?.teamId,
                teamName: teamName
            }
            const response = await Api.post('/api/admin/edit/team',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            const data2 = await response.data;
            setSuccess(data2.message);
            togglePopUpForEditTeam();
            getTeamInfo();
        }
        catch (error) {
            setError(error.response.data.message);
            togglePopUpForEditTeam();
        }
    }

    const deleteTeam = async () => {
        try {
            const data = {
                teamId: team[0]?.teamId,
            }
            const response = await Api.post('/api/admin/delete/team',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            const data2 = await response.data;
            setSuccess(data2.message);
            togglePopUpForEditTeam();
            getTeamInfo();
        }
        catch (error) {
            setError(error.response.data.message);
            togglePopUpForEditTeam();
        }
    }

    const createRole = async () => {
        try {
            const data = {
                teamId: team[0]?.teamId,
                roleName: roleName
            }
            const response = await Api.post('/api/admin/create/role',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            const data2 = await response.data;
            setSuccess(data2.message);
            setError(null);
            getTeamInfo();
        }
        catch (error) {
            setError(error.response.data.message);
        }
    }


    return (
        <div>
            <NavBar user={user} />
            <a href="/user-workspace">
                <div className='pl-2 bg-green-200 hover:text-white'>
                    <p>Go Back To Dashboard</p>
                </div>
            </a>
            <div className='text-center p-2 font-bold'>
            <FontAwesomeIcon icon={faPeopleGroup} style={{color: "#578dea",}} />
                <h1>Team Managament</h1>
            </div>
            {success && <div className='text-center text-green-500'>{success}</div>}
            {error && <div className='text-center text-red-500' >{error}</div>}

            {/* for popup for edit team */}
            {showPopUpForEditTeam&& <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Change Team Name
                                    </h3>
                                    <button type="button" onClick={togglePopUpForEditTeam} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex flex-col">
                                        <label htmlFor="team-name" className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Team Name</label>
                                        <input type="text" id="team-name" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter Team Name" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:ring-gray-500 dark:focus:border-gray-500" />
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <button type="button" onClick={editTeam} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}

            <div className='p-3'>
                <h1 className='font-bold'>Team Details</h1>
                <p><span className='text-blue-700'>Name </span>: {team[0]?.teamName}</p>
                <p><span className='text-blue-700'>Created on</span>: {new Date(team[0]?.createdOn).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</p>
            </div>
            <div className='p-3'>
                <button type="button" onClick={togglePopUpForEditTeam} className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900">Edit Team Details</button>
                <button type="button"  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete Team</button>
            </div>
            <hr />
            <div>
            <div className='text-center p-3'>
                    <h1 className='font-bold'>Create Role</h1>
                </div>
                <div>
                    <div style={{ marginLeft: '3rem', marginRight: '3rem' }}>
                        <input type="text" id="name" onChange={e => setRoleName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Role Name eg. Manager"></input>
                    </div>
                    <div className='text-center pt-2'>
                        <button type="button" onClick={createRole} className="focus:outline-none text-white bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-blue-900">Create</button>
                    </div>
                </div>
            </div>
            <p>ALL roles in this team / delete role</p>
        </div>
    )
}

export default TeamSettings
