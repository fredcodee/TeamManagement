import React from 'react'
import NavBar from '../components/NavBar'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import PopUp from '../components/PopUp';

const UserManagement = () => {
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const [user, setUser] = useState([]);
    const [team, setTeam] = useState([]);
    const history = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [usersAndRoles, setUsersAndRoles] = useState([]);
    let [isOpen, setIsOpen] = useState(false);
    const [inviteUserEmail, setInviteUserEmail] = useState('');
    const [roles, setRoles] = useState([]); //all roles in a 
    const [currentUserRole, setCurrentUserRole] = useState(''); //current role of user
    const [currentUser, setCurrentUser] = useState([]); //current user id for role change
    const [newRole, setNewRole] = useState(''); //new role for user
    const [isOpen2, setIsOpen2] = useState(false); //for role change popup
    const [isOpen3, setIsOpen3] = useState(false); // for remove user popup

    useEffect(() => {
        getUser(),
            getTeamInfo();
    }, [])

    useEffect(() => {
        adminCheckFunc(),
            getUsersAndRoles()
    }, [team])




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

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    //for role change
    const togglePopup2 = () => {
        setIsOpen2(!isOpen2)
    }

    // for remove user fron team
    const togglePopup3 = () => {
        setIsOpen3(!isOpen3);
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
        }
    }
    const adminCheckFunc = async () => {
        try {
            const data = {
                teamId: team[0].teamId,
                userId: user._id
            }
            const response = await Api.post("/api/admin/check-admin", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data2 = await response.data;
            if (data2 === false) {
                history('/user-workspace');
            }
        }
        catch (error) {
        }
    }

    const getUsersAndRoles = async () => {
        try {
            const teamId = {
                teamId: team[0].teamId
            }
            const response = await Api.post('/api/admin/team/all/user&roles', teamId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.data;
            setUsersAndRoles(data);
            getRoles();
        }
        catch (error) {

        }
    }

    const handleSubmitInvite = async () => {
        try {
            const data = {
                teamId: team[0].teamId,
                email: inviteUserEmail
            }
            const response = await Api.post('/api/admin/invite/user', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data2 = await response.data;
            setSuccess(data2);
            togglePopup()
            getUsersAndRoles();
        }
        catch (error) {
            setError(error.response.data);
            togglePopup();
        }
    }

    const getRoles = async () => {
        const teamId = {
            teamId: team[0].teamId
        }
        const response = await Api.post('/api/admin/team/all/roles', teamId, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await response.data;
        setRoles(data);
    }
    const getCurrentUserRole = async (roleName, user) => {
        setCurrentUserRole(roleName);
        setCurrentUser(user);

    }

    const getCurrentUser = async (user) => {
        setCurrentUser(user);
    }

    const handleRoleChange = async () => {
        try {
            const data = {
                teamId: team[0].teamId,
                userId: currentUser._id,
                roleId: newRole
            }
            const response = await Api.post('/api/admin/add/user/role', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data2 = await response.data;
            setSuccess(data2);
            togglePopup2();
            getUsersAndRoles();
        }
        catch (error) {
            setError(error.response.data);
            togglePopup2();
        }
    }

    // remove user from team
    const handleRemoveUser = async () => {
        try {
            const data = {
                teamId: team[0].teamId,
                userId: currentUser._id
            }
            const response = await Api.post('/api/admin/remove/user/team', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data2 = await response.data;
            setSuccess(data2);
            togglePopup3();
            getUsersAndRoles();
        }
        catch (error) {
            setError(error.response.data);
            togglePopup3();
        }
    }

    return (
        <div>
            <NavBar user={user} />
            <a href="/user-workspace">
                <div className='pl-2 bg-orange-200 hover:text-white'>
                    <p>Go Back To Dashboard</p>
                </div>
            </a>
            <div className='text-center p-4'>
                <button type="button" onClick={togglePopup} className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Invite User to {team[0]?.teamName}</button>
            </div>
            {/* for popup for invite */}
            {isOpen && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Invite New User To {team[0]?.teamName}
                                    </h3>
                                    <button type="button" onClick={togglePopup} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="input-group mb-3">
                                        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" onChange={e => setInviteUserEmail(e.target.value)}></input>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <button type="button" onClick={handleSubmitInvite} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Invite</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}

            {/* popup for remove role */}
            {
                isOpen2 && <PopUp
                    content={<>
                        <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                            <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Change User Role for <span className='text-green-700'>{currentUser.email}</span>
                                        </h3>
                                        <button type="button" onClick={togglePopup2} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <p>Current role: <span className='text-blue-800'>{currentUserRole}</span></p>
                                        </div>
                                        <div className="input-group mb-3">
                                            <select id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => setNewRole(e.target.value)}>
                                                {
                                                    roles.map((role, index) => {
                                                        return <option key={index} value={role._id}>{role.name}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                        <button type="button" onClick={handleRoleChange} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Change</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>}
                />}
            {/* popup for remove user from team */}
            {
                isOpen3 && <PopUp
                    content={<>
                        <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                            <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                           Remove <span className='text-green-700'>{currentUser.email}</span> from {team[0]?.teamName}
                                        </h3>
                                        <button type="button" onClick={togglePopup2} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <p>Confirm Action ?</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                        <button type="button" onClick={handleRemoveUser} className="text-white bg-red-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Yes</button>
                                        <button type="button" onClick={togglePopup3} className="text-white bg-green-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">No</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}
                />
            }

            <div>
                {error && <div className="text-red-500 text-sm p-2 text-center">
                    {error.message}
                </div>}
                {success && <div className="text-green-500 text-sm p-2 text-center">
                    {success.message}
                </div>}
            </div>
            <div>
                <div className='text-center p-3 font-bold'>
                    <h1>Users in <span className='text-purple-500'>{team[0]?.teamName}</span></h1>
                </div>
                <div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Full name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    usersAndRoles.map((user, index) => (
                                        <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={index}>
                                            {user.user.firstName === null ? (
                                                <th scope="row" className="px-6 py-4 font-medium text-green-600 whitespace-nowrap">
                                                    Invited User
                                                </th>
                                            ) : (
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {user.user.firstName} {user.user.lastName}
                                                </th>
                                            )}
                                            <td className="px-6 py-4 text-blue-600 hover:text-red-800">
                                                <a href="#" onClick={() => { togglePopup2(); getCurrentUserRole(user.role.name, user.user); }}>
                                                    {user.role.name}
                                                </a>

                                            </td>
                                            <td className="px-6 py-4">
                                                {user.user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a href="#" onClick={() => { togglePopup3(); getCurrentUser(user.user); }} className="font-medium text-red-600 hover:underline">Remove User</a>
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
    )
}

export default UserManagement
