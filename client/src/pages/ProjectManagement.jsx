import React from 'react'
import NavBar from '../components/NavBar'
import Api from '../Api'
import { useState, useEffect } from 'react'
import PopUp from '../components/PopUp';

const ProjectManagement = () => {
  const token = localStorage.getItem('authTokens').replace(/"/g, '');
  const [user, setUser] = useState([]);
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getUser(),
      getTeamInfo()
  }, [])

  useEffect(() => {
    getProjects()
  }, [team])

  const togglePopup = () => {
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

  const getProjects = async () => {
    try {
      const teamId = {
        teamId: team[0].teamId
      }

      const response = await Api.post('/api/admin/all/projects', teamId, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      const data = await response.data;
      setProjects(data);
    }
    catch (error) {
      console.log(error)
    }
  }
  const handleCreateProject = async () => {
    try {
      const project = {
        projectName: projectName,
        projectDescription: projectDescription,
        teamId: team[0].teamId
      }
      const response = await Api.post('/api/admin/new/project', project, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      const data = await response.data;
      if (data) {
        togglePopup();
        setSuccess('Project Created Successfully');
        getProjects();
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <NavBar user={user} />
      <a href="/user-workspace">
        <div className='pl-2 bg-purple-200 hover:text-white'>
          <p>Go Back To Dashboard</p>
        </div>
      </a>

      <div className='text-center p-4'>
        <h1 className='text-3xl pb-3 font-bold'>Project Management Section</h1>
        <hr />
        {success && <div className='text-green-500'>{success}</div>}
        <div>
            <button className='bg-blue-500 hover:bg-purple-700 text-white py-2 px-4 rounded mt-4' onClick={togglePopup} >
              Create New Project
            </button>
        </div>
        {/* for popup for create project */}
        {isOpen && <PopUp
                content={<>
                    <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Create A New Project in {team[0]?.teamName}
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
                                        <label htmlFor="project-name" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Project Name
                                        </label>
                                        <div className="relative flex-1">
                                            <input type="text" id="project-name" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm" placeholder="Project Name"  onChange={e => setProjectName(e.target.value)}/>
                                        </div>
                                      </div>
                                      <div className="flex flex-col">
                                        <label htmlFor="project-description" className="block text-sm font-medium text-gray-900 dark:text-gray-200">

                                            Project Description
                                        </label>
                                        <div className="relative flex-1">
                                            <textarea id="project-description" rows="3" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm" placeholder="Project Description" onChange={e => setProjectDescription(e.target.value)}></textarea>
                                            </div>
                                        </div>

                                </div>
                                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <button type="button" onClick={handleCreateProject} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            />}
        <h1 className='pt-5 font-bold'>All Projects in <span className='text-orange-400'>{team[0]?.teamName}</span></h1>
        <div>
          {projects.map((project, index) => (
            <a href={`/project-page-admin/${project._id}`} key={index}>
              <div className='border-solid border-2 border-yellow-300 p-2 m-9 hover:bg-green-500 hover:text-white'>
                <h1 className='text-blue-800'>{project.name}</h1>
                <p>Created on : <span>{new Date(project.date).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</span></p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectManagement
