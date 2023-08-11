import React from 'react'
import NavBar from '../components/NavBar'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import PopUp from '../components/PopUp';

const ProjectManagement = () => {
  const token = localStorage.getItem('authTokens').replace(/"/g, '');
  const [user, setUser] = useState([]);
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getUser(),
      getTeamInfo()
  }, [])

  useEffect(() => {
    getProjects()
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
        <h1 className='p-3 font-bold'>All Projects in <span className='text-orange-400'>{team[0]?.teamName}</span></h1>
        <div>
          {projects.map((project, index) => (
            <a href={`/project-management/${project._id}`} key={index}>
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
