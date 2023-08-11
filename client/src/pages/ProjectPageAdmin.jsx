import React from 'react'
import NavBar from '../components/NavBar'
import Api from '../Api'
import { useState, useEffect } from 'react'
import  {useParams} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShield } from '@fortawesome/free-solid-svg-icons'
import PopUp from '../components/PopUp';


const ProjectPageAdmin = () => {
    const {id}  =  useParams();
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const [user, setUser] = useState([]);
    const [team, setTeam] = useState([]);
    const [project , setProject] = useState([]);


    useEffect(() => {
        getUser(),
            getTeamInfo()
    }, [])

    useEffect(() => {
        getProject()
    }, [id])




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
            const response = await Api.post('/api/user/project/info', projectId,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.data;
            setProject(data);

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
            <FontAwesomeIcon icon={faShield} style={{color: "#e4e660",}} />
                <h1>Project Management Page</h1>
            </div>
            <hr />

            <div className='p-3'>
                <h1 className='font-bold'>Project Details</h1>
                <p><span className='text-blue-700'>Name </span>: {project.name}</p>
                <p><span className='text-blue-700'>Description </span>: {project.info}</p>
                <p><span className='text-blue-700'>Created on</span>: {new Date(project.date).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</p>
            </div>
            <div></div>
            
        </div>
    )
}

export default ProjectPageAdmin
