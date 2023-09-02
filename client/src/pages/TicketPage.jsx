import React from 'react'
import Api from '../Api'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PopUp from '../components/PopUp';
import "../assets/styles/ticketPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faCircleCheck, faComments, faUser, faUsers, faArrowsRotate, faXmark} from '@fortawesome/free-solid-svg-icons'



const TicketPage = () => {
  const token = localStorage.getItem('authTokens').replace(/"/g, '');
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [team, setTeam] = useState([]);
  const [ticket, setTicket] = useState([]);
  const [showPopUpForAssignedUsers, setShowPopUpForAssignedUsers] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getUser(),
      getTicket(),
      getTeamInfo()
  }, [])

  useEffect(() => {
    getComments()
  }, [ticket])



  const togglePopUpForAssignedUsers = () => {
    setShowPopUpForAssignedUsers(!showPopUpForAssignedUsers);
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

  const getTicket = async () => {
    const response = await Api.post(`/api/user/project/ticket/details`, { ticketId: id }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;
    setTicket(data)
    console.log(data)
  }

  const postComment = async () => {
    try {
      const data = {
        teamId: team[0]?.teamId || ticket.organization_id,
        projectId: ticket.project_id,
        ticketId: ticket._id,
        comment: comment
      }
      const response = await Api.post(`/api/user/project/ticket/add/comment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await response.data;
      setSuccess('Comment posted successfully')
      getComments();
    }
    catch (error) {
      setError(error.response.data.message)
    }

  }

  // get ticket comments
  const getComments = async () => {
    const response = await Api.post(`/api/user/project/ticket/comments`, { ticketId: id }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;
    setComments(data)
  }


  return (
    <div>
      <NavBar user={user} />
      {/* popup for assigned user */}
      {showPopUpForAssignedUsers && <PopUp
        content={<>
          <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-2xl max-h-full" style={{ margin: "auto" }}>
              <div className="relative bg-gray-400 rounded-lg shadow dark:bg-gray-700">

                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    This Ticket was Assigned To:
                  </h3>
                  <button type="button" onClick={togglePopUpForAssignedUsers} className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    {ticket.assigned_to.length === 0 && <p className='text-orange-900'>No users assigned to this ticket <span><FontAwesomeIcon icon={faXmark} /></span></p>}
                    {ticket.assigned_to.map((user, index) => (
                      <div key={index}>
                        <h6 className="text-white"><span className='pr-2'><FontAwesomeIcon icon={faUser} style={{ color: "#2e77f5", }} /></span>{user["firstName"] && user["lastName"]
                          ? `${user["firstName"]} ${user["lastName"]}`
                          : "invited user"}</h6>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>}
      />}


      <div className='contents'>
        {/* Top buttons  and action details*/}
        <div className='text-center pt-3'>
          {error && <div className='text-red-500 pb-2'><p>{error} <span><FontAwesomeIcon icon={faTriangleExclamation} style={{ color: "red", }} /></span></p></div>}
          {success && <div className='text-green-500 pb-2'><p>{success} <span><FontAwesomeIcon icon={faCircleCheck} style={{ color: "green", }} /></span></p></div>}


          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Edit
            </span>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Delete Ticket
            </span>
          </button>
        </div>

        {/* ticket box */}
        <div className='detailsbox border-solid border-2 border-indigo-100 border-l-indigo-500 rounded-md drop-shadow-md'>
          <div className="grid grid-cols-3 gap-4">
            <div className="... sideContents p-4">
              <div className="title">
                <h1 className="font-bold">Ticket Name:</h1>
                <p>{ticket.title}</p>
              </div>
              <div className="status pt-2">
                <h1 className="font-bold">Status:</h1>
                <p className={`title-card-${ticket.status === 'in progress' ? ('in-progress') : (ticket.status)} pr-2 hover:text-green-400 hover:cursor-pointer`}>{ticket.status} <span><FontAwesomeIcon icon={faArrowsRotate} /></span></p>
              </div>
              <div className="priority pt-2">
                <h1 className="font-bold">Priority:</h1>
                <p className={`title-card-${ticket.priority}`}>{ticket.priority}</p>
              </div>
              <div className="type pt-2">
                <h1 className="font-bold">Type:</h1>
                <p className={`title-card-${ticket.type}`}>{ticket.type}</p>
              </div>
              <div className="type pt-2">
                <h1 className="font-bold">Project:</h1>
                {
                  ticket.project_id ? (
                    <p className={`title-card`}>{ticket.project_id["name"]}</p>
                  ) : (
                    <p>Unknown</p>
                  )
                }
              </div>

            </div>
            <div className="col-span-2 ... p-4 mr-14">
              <div>
                <p>{ticket.description}</p>
              </div>
              <div className="creator pt-4">
                <h1 className="font-bold">Creator:</h1>
                {ticket.created_by ? (
                  <p>{ticket.created_by['firstName']} {ticket.created_by['lastName']}</p>
                ) : (
                  <p>Unknown</p>
                )}
              </div>

              <div>
                <h1 className="font-bold pt-2">Created</h1>
                <p>{new Date(ticket.created_at).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</p>
              </div>
              <div className="deadline pt-2">
                <h1 className="font-bold">Deadline:</h1>
                <p className='text-red-500'>{new Date(ticket.deadLine).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'long', weekday: 'long' })}</p>
              </div>
              <div className="assignee pt-2 hover:cursor-pointer hover:text-blue-500 " onClick={togglePopUpForAssignedUsers}>
                <h1 className="">View Assigned Users <span><FontAwesomeIcon icon={faUsers} style={{ color: "#41955f", }} /></span></h1>
              </div>
            </div>
          </div>
        </div>

        {/* comment section */}
        <div className='text-center pt-5'>
          <FontAwesomeIcon icon={faComments} style={{ color: "#4b1f51", }} />
        </div>
        <div className='comment'>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="comment here" required onChange={e => setComment(e.target.value)} />
            <button onClick={postComment} className="text-white absolute right-2.5 bottom-2.5 bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Post</button>
          </div>
        </div>
        <div className="comments">
          <div className='text-center p-3'>
          {comments.length === 0 && <p className='text-orange-900'>No comments on this ticket <span><FontAwesomeIcon icon={faXmark} /></span></p>}
          </div>
          {
            comments.map((comment, index) => (
              <div key={index} className="commentBox border-solid border border-grey-200 border-grey-500 rounded-md">
                <div className="grid grid-cols-3 gap-4">
                  <div className="... sideContents p-4 bg-slate-500 text-white">
                    <div>
                      {comment.user_id ? (
                        <p className='text-lg font-bold'><span className='pr-2'><FontAwesomeIcon icon={faUser} style={{ color: "pink", }} /></span>{comment.user_id['firstName']} {comment.user_id['lastName']}</p>
                      ) : (
                        <p>Unknown</p>
                      )}
                      <p className='text-sm pt-5'>{new Date(comment.created_at).toLocaleDateString('en-US', { hour12: true, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'short', weekday: 'short' })}</p>
                    </div>
                  </div>
                  <div className="col-span-2 ... p-4 mr-14">
                    <div>
                      <p>{comment.comment}</p>
                      <div className='text-center text-sm  text-red-500 pt-5'>
                        <a href="#" className='pr-4'>Edit</a>
                        <a href="#">Delete</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default TicketPage
