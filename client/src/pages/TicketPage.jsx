import React from 'react'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PopUp from '../components/PopUp';
import "../assets/styles/ticketPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faCircleCheck, faComments, faUser, faUsers} from '@fortawesome/free-solid-svg-icons'

const TicketPage = () => {
  const token = localStorage.getItem('authTokens').replace(/"/g, '');
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [team, setTeam] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      <div className='contents'>
        <div className='text-center pt-3'>
          {error && <div className='text-red-500 pb-2'><p>{error} <span><FontAwesomeIcon icon={faTriangleExclamation} style={{color: "red",}} /></span></p></div>}
          {success && <div className='text-green-500 pb-2'><p>{success} <span><FontAwesomeIcon icon={faCircleCheck} style={{color: "green",}} /></span></p></div>}
        <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Edit Ticket</button>
        </div>
        <div className='detailsbox border-solid border-2 border-indigo-100 border-l-indigo-500 rounded-md drop-shadow-md'>
          <div className="grid grid-cols-3 gap-4">
            <div className="... sideContents p-4">
              <div className="title">
                <h1 className="font-bold">Ticket Name:</h1>
                <p>make a format big</p>
              </div>
              <div className="status pt-2">
                <h1 className="font-bold">Status:</h1>
                <p className='title-card-open'>Open</p>
              </div>
              <div className="priority pt-2">
                <h1 className="font-bold">Priority:</h1>
                <p className='title-card-high'>High</p>
              </div>
              <div className="type pt-2">
                <h1 className="font-bold">Type:</h1>
                <p className='title-card-task'>Task</p>
              </div>
            </div>
            <div className="col-span-2 ... p-4 mr-14">
              <div>
                <p>Ticket description</p>
              </div>
              <div className="creator pt-4">
                <h1 className="font-bold">Creator:</h1>
                <p>John Doe</p>
              </div>
              <div>
                <h1 className="font-bold pt-2">Created</h1>
                <p>2021/10/10</p>
              </div>
              <div className="deadline pt-2">
                <h1 className="font-bold">Deadline:</h1>
                <p className='text-red-700'>2021/10/10</p>
              </div>
              <div className="assignee pt-2 hover:cursor-pointer hover:text-blue-500">
                <h1 className="">View Assigned Users <span><FontAwesomeIcon icon={faUsers} style={{color: "#41955f",}} /></span></h1>
                </div>
            </div>
          </div>
        </div>

        <div className='text-center pt-5'>
          <FontAwesomeIcon icon={faComments} style={{color: "#4b1f51",}} />
        </div>
        <div className="comments">

          <div className="commentBox border-solid border border-grey-200 border-grey-500 rounded-md">
            <div className="grid grid-cols-3 gap-4">
              <div className="... sideContents p-4 bg-slate-500 text-white">
                <div>
                  <p className='text-lg font-bold'><span className='pr-2'><FontAwesomeIcon icon={faUser} style={{color: "pink",}} /></span>Dean Mike</p>
                  <p className='text-sm pt-5'>20 Aug, 2023 2:45 pm</p>
                </div>
              </div>
              <div className="col-span-2 ... p-4 mr-14">
                <div>
                  <p>i like this design :)</p>
                  <div className='text-center text-sm  text-red-500 pt-5'>
                    <a href="#" className='pr-4'>Edit</a>
                    <a href="#">Delete</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="commentBox border-solid border border-grey-200 border-grey-500 rounded-md">
            <div className="grid grid-cols-3 gap-4">
              <div className="... sideContents p-4 bg-slate-500 text-white">
                <div>
                  <p className='text-lg font-bold'><span className='pr-2'><FontAwesomeIcon icon={faUser} style={{color: "pink",}} /></span>Dean Mike</p>
                  <p className='text-sm pt-5'>20 Aug, 2023 2:45 pm</p>
                </div>
              </div>
              <div className="col-span-2 ... p-4 mr-14">
                <div>
                  <p>i like this design :)</p>
                  <div className='text-center text-sm  text-red-500 pt-5'>
                    <a href="#" className='pr-4'>Edit</a>
                    <a href="#">Delete</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TicketPage
