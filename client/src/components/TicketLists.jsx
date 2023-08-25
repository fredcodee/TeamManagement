import React from 'react'
import Api from '../Api'
import { useState, useEffect } from 'react'
import '../assets/styles/projectpage.css'

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
                        <a href="/ticket/93939999">
                            <li className="column__item hover:bg-gray-300">
                            <div className="column__title--wrapper">
                                <h2>Incoming Bugs</h2>
                            </div>
                            <ul className="card__list">
                                <li className="card__item">
                                    <span className="card__tag medium">Medium Priority </span>
                                    <span className="card__tag open pr-2">open(status)</span>
                                    <span className="card__tag bug pr-2">bug(type)</span>
                                    <h6 className="card__title">Lightbox loading issue on Safari</h6>
                                </li>
                                <li className="card__item">
                                    <h6 className="card__title">Created by: Jason</h6>
                                    <h6 className="card__title">Deadline: 24th jun , 2024</h6>
                                </li>
                                <li className="card__item">
                                    <h6 className="card__title">Assigned to:</h6>
                                    <ol className="card__actions">
                                        <li className="card__actions--wrapper">
                                            <i className="fas fa-align-left"></i></li>
                                    </ol>
                                </li>
                            </ul>
                        </li></a>
                        <a href="/ticket/93939999"><li className="column__item hover:bg-gray-300">
                            <div className="column__title--wrapper">
                                <h2>In Progress</h2>
                            </div>
                            <ul className="card__list">
                                <li className="card__item">
                                    <span className="card__tag high">High Priotity</span>
                                    <span className="card__tag resolved pr-2">resolved</span>
                                    <span className="card__tag task pr-2">task</span>
                                    <h6 className="card__title">Localization</h6>
                                </li>
                                <li className="card__item">
                                    <h6 className="card__title">Created by: Jason</h6>
                                    <h6 className="card__title">Deadline: 25th jun , 2024</h6>
                                </li>
                                <li className="card__item">
                                    <h6 className="card__title">Assigned to:</h6>
                                    <ol className="card__actions">
                                        <li className="card__actions--wrapper">
                                            <i className="fas fa-align-left"></i></li>
                                    </ol>
                                    
                                </li>
                            </ul>
                        </li></a>
                        <a href="/ticket/93939999"><li className="column__item hover:bg-gray-300">
                            <div className="column__title--wrapper">
                                <h2>QA</h2>
                            </div>
                            <ul className="card__list">
                                <li className="card__item">
                                <span className="card__tag low">low Priority</span>
                                <span className="card__tag inprogress pr-">in progress</span>
                                    <span className="card__tag feature pr-2">feature</span>
                                    <h6 className="card__title">Embed all the things</h6>
                                </li>

                                <li className="card__item">
                                    <h6 className="card__title">Created by: Jason</h6>
                                    <h6 className="card__title">Deadline: 25th jun , 2024</h6>
                                </li>
                                <li className="card__item">
                                    <h6 className="card__title">Assigned to:</h6>
                                    <ol className="card__actions">
                                        <li className="card__actions--wrapper">
                                            <i className="fas fa-align-left"></i></li>
                                    </ol>
                                    
                                </li>
                            </ul>
                        </li></a>
                    </ul>
                </section>
            </div>
        </div>
    )
}

export default TicketLists
