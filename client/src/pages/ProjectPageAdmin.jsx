import React from 'react'
import NavBar from '../components/NavBar'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShield } from '@fortawesome/free-solid-svg-icons'
import PopUp from '../components/PopUp';


const ProjectPageAdmin = () => {
    const { id } = useParams();
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const [user, setUser] = useState([]);
    const [team, setTeam] = useState([]);
    const [project, setProject] = useState([]);
    const history = useNavigate();
    const [showPopUp, setShowPopUp] = useState(false);
    const [showPopUpForDelete, setShowPopUpForDelete] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectInfo, setProjectInfo] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [newUser, setNewUser] = useState('') //user to add to project
    const [removeUser , setRemoveUser] = useState('') //user to remove from project
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    let [isOpen, setIsOpen] = useState(false); //popup for remove user




    useEffect(() => {
        getUser(),
            getTeamInfo(),
            getProject()
    }, [])

    useEffect(() => {
        getAllUsers()
    }, [team])




    const togglePopUp = () => {
        setShowPopUp(!showPopUp);
    };

    const togglePopUpForDelete = () => {
        setShowPopUpForDelete(!showPopUpForDelete);
    };

    const togglePopup2 = () => {
        setIsOpen(!isOpen);
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
    }

    const getProject = async () => {
        const projectId = {
            projectId: id
        }
        const response = await Api.post('/api/user/project/info', projectId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.data;
        setProject(data);
        setProjectName(data.name);
        setProjectInfo(data.info);

    }
    const deleteProject = async () => {
        const data = {
            teamId: team[0]?.teamId,
            projectId: id
        }
        const response = await Api.post('/api/admin/project/delete', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await response.data;
        history('/project-management');

    }

    const editProject = async () => {
        const data = {
            teamId: team[0]?.teamId,
            projectId: id,
            projectName: projectName,
            projectDescription: projectInfo
        }
        const response = await Api.post('/api/admin/project/edit', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await response.data;
        setSuccess('Changes Made Successfully');
        getProject();
        togglePopUp();

    }
    const getAllUsers = async () => {
        const data = {
            teamId: team[0]?.teamId,
            projectId: id
        }
        const response = await Api.post('/api/admin/project/all/users', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data2 = await response.data;
        setAllUsers(data2);
    }

    const addUserToProject = async () => {
        try {
            // get userid
            const getUserResponse = await Api.post('/api/admin/get/user-by-email', { email: newUser }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const userId = getUserResponse.data._id;

            const data = {
                teamId: team[0]?.teamId,
                projectId: id,
                userId: userId
            }
            console.log(data)

            const response = await Api.post('/api/admin/project/add/user', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data2 = await response.data
            setSuccess("User Added to this Project")
            getAllUsers()
            setError(null); // Clear any previous errors if successful
        }
        catch (err) {
            setError(err.response?.data?.message || "An error occurred");
            setSuccess(null); // Clear success message on error
        }

    }

    const removeUserFromProject = async()=>{
        try{
            const data = {
                teamId: team[0]?.teamId,
                userId: removeUser._id,
                projectId:id
            }
            const response = await Api.post('/api/admin/project/remove/user', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data2 = await response.data;
            setSuccess(data2);
            setError(null); // Clear any previous errors if successful
            togglePopup2();
            getUsersAndRoles();
        }
        catch (err) {
            setError(err.response?.data?.message || "An error occurred");
            setSuccess(null); // Clear success message on error
            togglePopup2();
        }
    }


    return (
        <div>
            <NavBar user={user} />
            <div className='pl-2 bg-pink-200 '>
                <a href="/user-workspace" className='hover:text-orange-500'>Go Back To Dashboard
                </a>
                <a href="/project-management" className='hover:text-orange-500'> / Project-Management</a>
            </div>

            <div className='text-center p-2 font-bold'>
                <FontAwesomeIcon icon={faShield} style={{ color: "#e4e660", }} />
                <h1>Project Management Page</h1>
            </div>
            <hr />
            {success && <div className='text-center text-green-500'>{success}</div>}
            {error && <div className='text-center text-red-500' >{error}</div>}
            {/* for popup for edit project */}
            {showPopUp && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Edit Project Details
                                    </h3>
                                    <button type="button" onClick={togglePopUp} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex flex-col">
                                        <label htmlFor="project-name" className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Project Name</label>
                                        <input type="text" id="project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter Project Name" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:ring-gray-500 dark:focus:border-gray-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="project-info" className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Project Info</label>
                                        <textarea type="text" id="project-info" value={projectInfo} onChange={(e) => setProjectInfo(e.target.value)} placeholder="Enter Project Info" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:ring-gray-500 dark:focus:border-gray-500" />
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <button type="button" onClick={editProject} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}
            {/* popup for deleting project */}
            {
                showPopUpForDelete && <PopUp
                    content={<>
                        <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                            <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-red-700 dark:text-white">
                                            Delete   this Project
                                        </h3>
                                        <button type="button" onClick={togglePopUpForDelete} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
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
                                        <button type="button" onClick={deleteProject} className="text-white bg-red-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Yes</button>
                                        <button type="button" onClick={togglePopUpForDelete} className="text-white bg-green-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">No</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}
                />
            }
            {/* popup for removing user from project */}
            {
                isOpen && <PopUp
                    content={<>
                        <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                            <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                           Remove <span className='text-green-700'>{removeUser.email}</span> from this project
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
                                        <button type="button" onClick={removeUserFromProject} className="text-white bg-red-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Yes</button>
                                        <button type="button" onClick={togglePopup2} className="text-white bg-green-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">No</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}
                />
            }



            <div className='p-3'>
                <h1 className='font-bold'>Project Details</h1>
                <p><span className='text-blue-700'>Name </span>: {project.name}</p>
                <p><span className='text-blue-700'>Description </span>: {project.info}</p>
                <p><span className='text-blue-700'>Created on</span>: {new Date(project.date).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</p>
            </div>
            <div className='p-3'>
                <button type="button" onClick={togglePopUp} className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900">Edit Project Details</button>
                <button type="button" onClick={togglePopUpForDelete} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete Project</button>
            </div>
            <hr />
            <div>
                <div className='text-center p-3'>
                    <h1>Add user to this project</h1>
                </div>
                <div>
                    <div style={{ marginLeft: '3rem', marginRight: '3rem' }}>
                        <input type="email" id="email" onChange={e => setNewUser(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com"></input>
                    </div>
                    <div className='text-center pt-2'>
                        <button type="button" onClick={addUserToProject} className="focus:outline-none text-white bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-blue-900">Add User</button>
                    </div>
                </div>
                <div className='text-center p-3'>
                    <h1>Users in this project</h1>
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
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allUsers.map((userr, index) => (
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
                                            <td className="px-6 py-4">
                                                <a href="#" onClick={() => { togglePopup2(); setRemoveUser(userr); }} className="font-medium text-red-600 hover:underline">Remove User</a>
                                            </td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>



            </div>


            <hr />
            <div>
                Roles and permissions setings fro this project
            </div>

        </div>
    )
}

export default ProjectPageAdmin
