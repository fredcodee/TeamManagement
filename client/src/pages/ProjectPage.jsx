import React from 'react'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PopUp from '../components/PopUp';
import TicketLists from '../components/TicketLists';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMapPin } from '@fortawesome/free-solid-svg-icons'


const ProjectPage = () => {
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const { id } = useParams();
    const [project, setProject] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [team, setTeam] = useState([]);
    const [rolePermission, setRolePermission] = useState([]);
    const [ticketName, setTicketName] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketType, setTicketType] = useState('');
    const [ticketPriority, setTicketPriority] = useState('');
    const [ticketStatus, setTicketStatus] = useState('');
    const [ticketDueDate, setTicketDueDate] = useState('');
    const [ticketAssignTo, setTicketAssignTo] = useState([]);
    const [pinned, setPinned] = useState('');
    const [showPopUpForProjectDescription, setShowPopUpForProjectDescription] = useState(false);
    const [showPopUpForMembers, setShowPopUpForMembers] = useState(false);
    const [showPopUpForInvite, setShowPopUpForInvite] = useState(false);
    const [showPopUpForRemove, setShowPopUpForRemove] = useState(false);
    const [showPopUpForPermissions, setShowPopUpForPermissions] = useState(false);
    const [showPopUpForCreateTicket, setShowPopUpForCreateTicket] = useState(false);
    const [projectMembers, setProjectMembers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [userToInvite, setUserToInvite] = useState('');
    const [userToRemove, setUserToRemove] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        getProject(),
            getUser(),
            getTeamInfo(),
            getProjectMembers(),
            getUserRoleInfo();
    }, [])
    useEffect(() => {
        console.log(rolePermission['permissisons'])
    }, [project])


    const togglePopUpForProjectDescription = () => {
        setShowPopUpForProjectDescription(!showPopUpForProjectDescription);
    }
    const togglePopUpForMembers = () => {
        setShowPopUpForMembers(!showPopUpForMembers);
    }

    const togglePopUpForInvite = () => {
        setShowPopUpForInvite(!showPopUpForInvite);
    }

    const togglePopUpForRemove = () => {
        setShowPopUpForRemove(!showPopUpForRemove);
    }
    const togglePopUpForPermissions = () => {
        setShowPopUpForPermissions(!showPopUpForPermissions);
    }
    const togglePopUpForCreateTicket = () => {
        setShowPopUpForCreateTicket(!showPopUpForCreateTicket);
    }

    const getProject = async () => {
        try {
            const response = await Api.post(`/api/user/project/info`, { projectId: id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.data;
            if (data === null) {
                navigate('/error')
            }
            setProject(data);
            
        } catch (error) {
            navigate('/error')
        }
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
            navigate('/login');
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
        setTeam(data)
        getTeamMembers();
    }

    const getProjectMembers = async () => {
        const data = {
            projectId: id
        }
        const response = await Api.post('/api/admin/project/all/users', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data2 = await response.data;
        setProjectMembers(data2);

    }

    const getTeamMembers = async () => {
        const data = {
            teamId: team[0]?.teamId
        }
        const response = await Api.post('/api/user/team/all/users', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const data2 = await response.data;
        setTeamMembers(data2);

    }

    const inviteUser = async () => {
        try {
            const data = {
                projectId: id,
                userId: userToInvite,
                teamId: team[0]?.teamId
            }

            const response = await Api.post('/api/admin/project/add/user', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data2 = await response.data;
            setSuccess(data2.message);
            togglePopUpForInvite();
            getProjectMembers();

        } catch (error) {
            setError('you dont have permission to invite a user');
            togglePopUpForInvite();
            getProjectMembers();
        }
    }

    const removeUser = async () => {
        try {
            const data = {
                projectId: id,
                userId: userToRemove,
                teamId: team[0]?.teamId
            }

            const response = await Api.post('/api/admin/project/remove/user', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data2 = await response.data;
            setSuccess(data2.message);
            togglePopUpForRemove();
            getProjectMembers();

        } catch (error) {
            setError("you don't have permission to remove a user");
            togglePopUpForRemove();
            getProjectMembers();
        }
    }
    const getUserRoleInfo = async () => {
        const response = await Api.post('/api/user/project/user/roleinfo', { projectId: id }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const data = await response.data;
        setRolePermission(data);
    }

    const leaveProject = async () => {
        try {
            const data = {
                projectId: id,
            }

            const response = await Api.post('/api/user/project/leave', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data2 = await response.data;
            navigate('/user-workspace')

        } catch (error) {
            setError(error.response.data.message);
        }
    }


    //select user to assign
    const handleSelectChangeAssign = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
        setTicketAssignTo(selectedValues);
    };

    const createTicket = async () => {
        try {
            const data = {
                projectId: id,
                teamId: team[0]?.teamId,
                userId: user._id,
                ticketName: ticketName,
                ticketDescription: ticketDescription,
                ticketType: ticketType,
                ticketPriority: ticketPriority,
                ticketStatus: ticketStatus,
                ticketDueDate: ticketDueDate,
                ticketAssignTo: ticketAssignTo,
                ticketReporter: user._id,
                pinned: pinned
            }

            const response = await Api.post('/api/admin/project/ticket/add', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            await response.data;
            window.location.reload();

        } catch (error) {
            setError(error.response.data.message);
            togglePopUpForCreateTicket();
        }
    }




    return (
        <div>
            <NavBar user={user} />
            {/* for popup for project description*/}
            {showPopUpForProjectDescription && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Project Description
                                    </h3>
                                    <button type="button" onClick={togglePopUpForProjectDescription} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <p>{project.info}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}
            {/* for popup for project members*/}
            {showPopUpForMembers && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-gray-300 rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Project Members
                                    </h3>
                                    <button type="button" onClick={togglePopUpForMembers} className="text-white bg-transparent hover:bg-white hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        Full name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Email
                                                    </th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    projectMembers.map((userr, index) => (
                                                        <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={index}>
                                                            {userr.email === user.email ? (
                                                                <th scope="row" className="px-6 py-4 font-medium text-blue-700 whitespace-nowrap dark:text-white">
                                                                    you (current user)
                                                                </th>
                                                            ) : userr.firstName === null ? (
                                                                <td scope="row" className="px-6 py-4 font-medium text-green-600 whitespace-nowrap">
                                                                    Invited User
                                                                </td>
                                                            ) : (
                                                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                    {userr.firstName} {userr.lastName}
                                                                </td>
                                                            )}
                                                            <td className="px-6 py-4">
                                                                {userr.email}
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}

            {/* for popup for invite */}
            {showPopUpForInvite && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Invite User To {project.name}
                                    </h3>
                                    <button type="button" onClick={togglePopUpForInvite} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <select id="members" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => setUserToInvite(e.target.value)}>
                                            <option value="">Select User</option>
                                            {
                                                teamMembers.map((member, index) => {
                                                    return <option key={index} value={member._id}>{member.firstName || "invited user"},  {member.email}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <button type="button" onClick={inviteUser} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Invite</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}
            {/* for popup for remove user */}
            {showPopUpForRemove && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Remove User from {project.name} <br />
                                        <small className='text-red-900'>**Only Roles with 'Remove' permission can perform this action***</small>
                                    </h3>
                                    <button type="button" onClick={togglePopUpForRemove} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <select id="members" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => setUserToRemove(e.target.value)}>
                                            <option value="">Select User</option>
                                            {
                                                projectMembers.map((member, index) => {
                                                    return <option key={index} value={member._id}>{member.firstName || "invited user"},  {member.email}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <button type="button" onClick={removeUser} className="text-white bg-red-600 hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Remove User</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}

            {/* for popup for permissions */}
            {showPopUpForPermissions && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Your Permssions in this Project
                                    </h3>
                                    <button type="button" onClick={togglePopUpForPermissions} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        {rolePermission.role === 'admin' ? (
                                            <p>You are an admin in this project and have all permissions</p>
                                        ) : (
                                            rolePermission['permissisons'] ? (
                                                rolePermission['permissisons'].map((permission, index) => (
                                                    <p key={index}>{permission.name}</p>
                                                ))
                                            ) : null
                                        )}
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </>}
            />}
            {/* for popup for create ticket */}
            {showPopUpForCreateTicket && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Create A New Ticket in {project.name} <br />
                                        <span className='text-orange-900'><small>***This action is only for admins and users with 'edit' permission***</small></span>
                                    </h3>
                                    <button type="button" onClick={togglePopUpForCreateTicket} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex flex-col">
                                        <label htmlFor="ticket-name" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Ticket Title
                                        </label>
                                        <div className="relative flex-1">
                                            <input type="text" id="ticket-name" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm" placeholder="Ticket Title eg. incoming bugs" onChange={e => setTicketName(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="Ticket-description" className="block text-sm font-medium text-gray-900 dark:text-gray-200">

                                            Ticket Description
                                        </label>
                                        <div className="relative flex-1">
                                            <textarea id="Ticket-description" rows="3" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm" placeholder="Ticket Description" onChange={e => setTicketDescription(e.target.value)} required></textarea>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-900 dark:text-gray-200" > Ticket Type</label>
                                        <select id="type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => setTicketType(e.target.value)} required>
                                            <option value="">Select Type</option>
                                            <option value="bug">Bug</option>
                                            <option value="feature">Feature</option>
                                            <option value="task">Task</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-900 dark:text-gray-200" > Ticket Status</label>
                                        <select id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => setTicketStatus(e.target.value)} required>
                                            <option value="">Select Status</option>
                                            <option value="open">Open</option>
                                            <option value="in progress">In Progress</option>
                                            <option value="closed">Closed</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-900 dark:text-gray-200" > Priority</label>
                                        <select id="priority" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => setTicketPriority(e.target.value)} required>
                                            <option value="">Select Priority</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-red-900 dark:text-gray-200" > Set Deadline</label>
                                        <input type="date" id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => setTicketDueDate(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label htmlFor="pin" className="block text-sm font-medium text-gray-900 dark:text-gray-200" > Pin this Ticket <span><FontAwesomeIcon icon={faMapPin} style={{ color: "#3f4724", }} /></span></label>
                                        <select id="pin" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => setPinned(e.target.value)} required>
                                            <option value="">Select</option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>

                                    </div>

                                    <div>
                                        <label htmlFor="assign" className="block text-sm font-medium text-gray-900 dark:text-gray-200" > Assign To: <span>(***use ctrl key**)</span></label>
                                        <select
                                            id="assign"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={handleSelectChangeAssign}
                                            required
                                            multiple
                                            value={ticketAssignTo} // Set the selected values here
                                        >
                                            {projectMembers.map((member, index) => (
                                                <option key={index} value={member._id}>
                                                    {member.firstName || "invited user"}, {member.email}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <button type="button" onClick={createTicket} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}

            <div className="grid grid-cols-3 gap-4">
                <div className="... sideContents p-4">
                    <div>
                        <h1 className="text-xl font-bold">{project.name}'s workspace</h1>
                    </div>
                    <hr />
                    <div>
                        <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                            <p onClick={togglePopUpForProjectDescription}>Project Description</p>
                        </div>
                        <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                            <p onClick={togglePopUpForMembers}>Members</p>
                        </div>
                        <div>
                            <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                                <p onClick={togglePopUpForPermissions}>View your permissions</p>
                            </div>
                        </div>
                        <div>
                            <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                                <p onClick={togglePopUpForCreateTicket}>Create Ticket</p>
                            </div>
                        </div>
                        <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                            <p onClick={togglePopUpForInvite}>Invite</p>
                        </div>
                        <div className='pt-4 hover:text-red-600 hover:cursor-pointer text-red-800'>
                            <p onClick={togglePopUpForRemove}>Remove User</p>
                        </div>

                        <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                            <button type="button" onClick={leaveProject} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Leave Project</button>
                        </div>
                    </div>

                </div>
                <div className="col-span-2 ... mr-14">
                    <div className='text-center'>
                        {error && <div className='text-red-500'>{error}</div>}
                        {success && <div className='text-green-500'>{success}</div>}
                    </div>
                    <div className='text-center p-4'>
                        <p className='p-4 hover:text-blue-500 hover:cursor-pointer' onClick={togglePopUpForCreateTicket}> Create A Ticket <span><FontAwesomeIcon icon={faPlus} style={{ color: "#d86fd8", }} /></span></p>
                        <hr />
                        <p className='p-2'>All tickets in {project.name}</p>
                    </div>
                    <div>
                        <TicketLists projectId={id} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectPage
