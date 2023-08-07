import React from 'react'
import NavBar from '../components/NavBar'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, } from '@fortawesome/free-solid-svg-icons'

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
        try {
            const response = await Api.get('/api/user/project/tickets', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.data;
            setTasks(data);
        }
        catch (error) {
            setError(error);
        }
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
                    {tickets.length > 0 ? (
                        tickets.map((ticket, index) => (
                            <div className='hover:bg-gray-300 pl-2' key={index}>
                                <a href="#">{ticket.title} <span className='text-red-600'>- Ticket deadline on {new Date(ticket.deadLine).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</span></a>
                            </div>
                        ))
                    ) : (
                        <div className='text-center'>
                            <p>You have no tickets...</p>
                        </div>
                    )}
                </div>
            </div>
            <div className='text-center p-4'>
                <h1 className='font-bold'><FontAwesomeIcon icon={faListCheck} className='pr-2' style={{ color: "orange" }} /> Tasks and Tickets you created</h1>
                <hr />
                <div>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <div className='hover:bg-gray-300 pl-2' key={index}>
                                <a href="#">{task.title} <span className='text-red-600'>- Ticket deadline on {new Date(task.deadLine).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</span></a>
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
    )
}

export default Tasks
