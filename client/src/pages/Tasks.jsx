import React from 'react'
import NavBar from '../components/NavBar'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, } from '@fortawesome/free-solid-svg-icons'
import '../assets/styles/tasks.css'

const Tasks = () => {
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const [user, setUser] = useState([]);
    const history = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        getUser();
        getTickets();
        getTasks();
    }, [])

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
    //all tickets assigned to user
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

    const getTasks = async () => {
        const response = await Api.get('/api/user/project/tickets/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await response.data;
        setTasks(data);
    }


    return (
        <div>
            <NavBar user={user} />
            <a href="/user-workspace">
                <div className='pl-2 bg-blue-200 hover:text-purple-800'>
                    <p>Go Back To Dashboard</p>
                </div>
            </a>


            <div className='text-center p-4'>
                <h1 className='font-bold'><FontAwesomeIcon icon={faListCheck} className='pr-2' style={{ color: "red" }} /> Tasks and Tickets assigned to you</h1>
                <hr />
                <div>
                    <div className="tasks-wrapper">
                        {tickets.length > 0 ? (
                            tickets.map((ticket, index) => (
                            <div className="task2" key={index}>
                                    <label for="item-1">
                                        <a href={`ticket/${ticket._id}`}>{ticket.title} </a>
                                    </label>
                                    <a href=""></a>
                                    <span className={`tag ${ticket.status === 'in progress' ? ('in-progress') : (ticket.status)}`}>{ticket.status}</span>
                            </div>
                            ))
                        ) : (
                            <div className='text-center'>
                                <p>You have no tickets...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='text-center p-4'>
                <h1 className='font-bold'><FontAwesomeIcon icon={faListCheck} className='pr-2' style={{ color: "orange" }} /> Tasks and Tickets you created</h1>
                <hr />
                <div>
                    <div className="tasks-wrapper">
                        {tasks.length > 0 ? (
                            tasks.map((task, index) => (
                                <div className="task2" key={index}>
                                    <label for="item-1">
                                        <a href={`ticket/${task._id}`}>{task.title} </a>
                                    </label>
                                    <a href=""></a>
                                    <span className={`tag ${task.status === 'in progress' ? ('in-progress') : (task.status)}`}>{task.status}</span>
                                </div>
                            ))
                        ) : (
                            <div className='text-center'>
                                <p>You have created no tickets yets...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tasks
