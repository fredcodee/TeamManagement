import React from 'react'

const PopUp = props => {
  return (
    <div className="popup-box">
      <div className="box">
        {props.content}
      </div>
      {/* <div>
        {props.cardId && props.userId ?
          <div className='unassignBtncon'>
            <button type="button" className="btn btn-danger" style={{ marginRight:"1rem"}} onClick={() => props.unasignUsers(props.cardId, props.userId)}>Yes</button>
            <button type="button" className="btn btn-info" onClick={props.handleClose}>No</button>
          </div>
        : <div></div>}
      </div> */}
    </div>
  )
}

export default PopUp