import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'

const SideMenuProjectList = ({ projects }) => {
    return (
        <div className='pt-2'>
            {projects.length === 0 && <div className='p-3'>You have no projects</div>}
            {projects.map((project, index) => {
                return (
                    <a href="#" key={index}>
                        <div className='hover:bg-gray-300 p-3'>
                            <FontAwesomeIcon icon={faReceipt} className='pr-2' />
                            {project.name}
                        </div>
                    </a>
                )
            })}
        </div>
    )
}

export default SideMenuProjectList
