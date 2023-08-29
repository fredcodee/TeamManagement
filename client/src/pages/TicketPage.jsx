import React from 'react'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PopUp from '../components/PopUp';
import "../assets/styles/ticketPage.css"

const TicketPage = () => {
  const token = localStorage.getItem('authTokens').replace(/"/g, '');
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    getUser(),
      getTeamInfo()
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
      <div>
      </div>
    </div>
  )
}

export default TicketPage
