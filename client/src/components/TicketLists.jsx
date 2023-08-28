import React from 'react'
import Api from '../Api'
import { useState, useEffect } from 'react'
import '../assets/styles/projectpage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'

const TicketLists = ({ projectId }) => {
    const token = localStorage.getItem('authTokens').replace(/"/g, '');
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        getTickets()
    }, [])

    const getTickets = async () => {
        try {
            const response = await Api.post(`/api/user/project/ticket/all`, { projectId: projectId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.data;
            setTickets(data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <div>
                <section className="wrapper">
                    <ul className="column__list">
                        {tickets.length === 0 && <p className='text-orange-900'>No tickets in this project <span><FontAwesomeIcon icon={faXmark} /></span></p>}
                        {tickets.map((ticket, index) => (
                            <a href={`/ticket/${ticket._id}`}>
                                <li className="column__item hover:bg-gray-300">
                                    <div className="column__title--wrapper">
                                        <h2>{ticket.title}</h2>
                                    </div>
                                    <ul className="card__list">
                                        <li className="card__item">
                                            <span className={`card__tag ${ticket.priority}`}>{ticket.priority}</span>
                                            <span className={`card__tag ${ticket.status} pr-2`}>{ticket.status}</span>
                                            <span className={`card__tag ${ticket.type} pr-2`}>{ticket.type}</span>
                                            <h6 className="card__title">{ticket.description}</h6>
                                        </li>
                                        <li className="card__item">
                                            <h6 className="card__title">Created by: {ticket.createdBy}</h6>
                                            <h6 className="card__title">Deadline: {ticket.deadline}</h6>
                                        </li>
                                        <li className="card__item">
                                            <h6 className="card__title">Assigned to:</h6>
                                            <ol className="card__actions">
                                                <li className="card__actions--wrapper">
                                                    <i className="fas fa-align-left"></i></li>
                                            </ol>
                                        </li>
                                    </ul>
                                </li>
                            </a>
                        )

                        )}
                    </ul>
                </section>
            </div>
        </div>
    )
}

export default TicketLists
