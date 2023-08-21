import React from 'react'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import popUp from '../components/PopUp';


const ProjectPage = () => {
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const { id } = useParams();
    const [project, setProject] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const  [team, setTeam] = useState([]);
    const [showPopUpForProjectDescription, setShowPopUpForProjectDescription] = useState(false);
    const [showPopUpForMembers, setShowPopUpForMembers] = useState(false);

    useEffect(() => {
        getProject(),
        getUser(),
        getTeamInfo()
    }, [])


    const togglePopUpForProjectDescription = () => {
        setShowPopUpForProjectDescription(!showPopUpForProjectDescription);
    }
    const togglePopUpForMembers = () => {
        setShowPopUpForMembers(!showPopUpForMembers);
    }

    const getProject = async () => {
        try {
            const response = await Api.post(`/api/user/project/info`, {projectId: id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
            }});
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
    }
  return (
    <div>
        <NavBar user={user} />
        <div className="grid grid-cols-3 gap-4">
            <div className="... sideContents p-4">
                <div>
                    <h1 className="text-xl font-bold">{project.name}'s workspace</h1>
                </div>
                <hr />
                <div>
                    <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                        <p>Project Description</p>
                    </div>
                    <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                        <p>Members</p>
                    </div>
                   <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'> 
                        <p>Invite</p>
                   </div>

                   <div className='pt-4 hover:text-purple-600 hover:cursor-pointer'>
                   <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Leave</button>
                   </div>
                </div>

            </div>
            <div className="col-span-2 ... mr-14"></div>

        </div>
    </div>
  )
}

export default ProjectPage
