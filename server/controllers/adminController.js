const errorHandler = require('../configs/errorHandler')
const userService = require('../services/userServices')
const appService = require('../services/appServices')
const mongoose = require('mongoose')




//invite users to team
const inviteUser = async (req, res) => {
    try {
        const email = req.body.email;
        const teamId = req.body.teamId;

        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }


        //check if user already exists
        const user = await userService.getUserByEmail(email);
        if (user) {
            //check if user is already in team
            const userInTeam = await userService.checkUserIsInOrganization(user._id, teamId);
            if (userInTeam) {
                return res.status(401).json({ message:`user is already in team or has been invited`});
            }
            //that means user exists to add to team
            await appService.addOrganizationToUser(user._id, teamId);
            return res.json({ message: 'user added to team successfully' });
        }

        const inviteId = await appService.inviteUserToOrganization(email, teamId);
        return res.json({ inviteId: inviteId });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//create roles
const createRole = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const roleName = req.body.roleName;
       
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //create role
        await appService.createRole(teamId, roleName);
        res.json({ message: 'role created successfully'});
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//add user to role
const addUserToRole = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const userId = req.body.userId;
        const roleId = req.body.roleId;
       
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //check if user has role already
        const userHasRole = await appService.checkUserHasRoleInOrganization(userId, teamId);
        if (userHasRole) {
            // Get the user's current role ID
            const userTeamInfo = await userService.getUserTeamInfo(userId);
            const userRoleId = userTeamInfo[0]?.roleId;
            // Remove the user from their current role
            await appService.removeUserFromRole(userId, userRoleId, teamId);
        }
        await appService.addUserToRole(userId, roleId, teamId);
        await appService.addNotificationToDbSingle( req, userId,teamId, `${req.user.firstName} ${req.user.lastName} change your role`,);
        res.json({ message: 'user added to role successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const removeUserFromRole = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const userId = req.body.userId;
        const roleId = req.body.roleId;
       
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //check if user has role already
        const userHasRole = await appService.checkUserHasRoleInOrganization(userId, teamId);
        if (!userHasRole) {
            return res.status(401).json({ message: 'user does not have a role in team' });
        }
        await appService.removeUserFromRole(userId, roleId, teamId);
        await appService.addNotificationToDbSingle(req, userId,teamId, `${req.user.firstName} ${req.user.lastName} removed your role`,);
        res.json({ message: 'user removed from role successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



const getTeamDetails = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        //check if user is in team
        const userInTeam = await userService.checkUserIsInOrganization(req.user._id, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'access denied user is not in team' });
        }
        //get team details
        const team = await appService.getOrganizationDetails(teamId);
        res.json(team);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}




const editTeamDetails = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const teamName = req.body.teamName;
       
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //edit team details
        await appService.editOrganizationDetails(teamId, teamName);
        const teamMembers = await userService.getAllUsersInTeam(teamId);
        await Promise.all(teamMembers?.map(async (member) => {
            const memberId = new mongoose.Types.ObjectId(member._id);
            if(!memberId.equals(req.user._id)){
                await appService.addNotificationToDbSingle(req, member._id, teamId, `${req.user.firstName} ${req.user.lastName} edited team details`,);}
        }));
        
        res.json({ message: 'team details edited successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



const removeUserFromTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const userId = req.body.userId;

        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        await appService.removeUserFromOrganization(userId, teamId);
        await appService.addNotificationToDbSingle(req, userId,teamId, `${req.user.firstName} ${req.user.lastName} removed you from team`,);
        res.json({ message: 'user removed from team successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



const createProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectName = req.body.projectName;
        const projectDescription = req.body.projectDescription;
       
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //create project
        await appService.addPermissions()
        const project = await appService.createProject(teamId, projectName, projectDescription);
        res.json(project);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const getUserInfoByEmail = async (req,res) =>{
    try{
        const email = req.body.email
        const user  = await userService.getUserByEmail(email)
        res.json(user)

    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//add user to project
const addUserToProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const userId = req.body.userId;
        const projectId = req.body.projectId;

        //check if user has permission to invite user || user is admin
        const userHasPermission = await userService.checkUserPermission(userId, teamId, projectId, "Invite");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck && !userHasPermission) {
            return res.status(401).json({ message: 'you dont not have permission to invite user' });
        }
        //check if user is in team
        const userInTeam = await userService.checkUserIsInOrganization(userId, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'user is not in team' });
        }
        //check if user is already in project
        const userInProject = await userService.checkUserIsInProject(userId, projectId);
        if (userInProject) {
            return res.status(401).json({ message: 'user is already in this project' });
        }
        //add user to project
        await appService.addUserToProject(userId, projectId);
        const projectLink = typeof projectId === 'string' ? `/project-page/${projectId}` : `/project-page/${projectId._id}`;
        await appService.addNotificationToDbSingle(req, userId,teamId, `${req.user.firstName} ${req.user.lastName} added you to project`, projectLink);
        res.json({ message: 'user added to project successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//remove user from project
const removeUserFromProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const userId = req.body.userId;
        const projectId = req.body.projectId;
       
        const userHasPermission = await userService.checkUserPermission(userId, teamId, projectId, "Remove");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck && !userHasPermission) {
            return res.status(401).json({ message: 'user does not have permission to remove user' });
        }

        const userInTeam = await userService.checkUserIsInOrganization(userId, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'user is not in team' });
        }

        const userInProject = await userService.checkUserIsInProject(userId, projectId);
        if (!userInProject) {
            return res.status(401).json({ message: 'user is not in project' });
        }
        

        await appService.removeUserFromProject(userId, projectId);
        await appService.addNotificationToDbSingle(req, userId,teamId, `${req.user.firstName} ${req.user.lastName} removed you from project`,);
        res.json({ message: 'user removed from project successfully' });

    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



const getAllProjectsInTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;

        const userInTeam = await userService.checkUserIsInOrganization(req.user._id, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'access denied user is not in team' });
        }

        const projects = await appService.getAllProjects(teamId);
        res.json(projects);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const getAllUsersInProject = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const users = await userService.getAllUsersInProject(projectId);
        res.json(users);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const editProjectDetails = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const projectName = req.body.projectName;
        const projectDescription = req.body.projectDescription;
        
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }

        const project = await appService.editProjectDetails(projectId, projectName, projectDescription);
        const projectLink = typeof projectId === 'string' ? `/project-page/${projectId}` : `/project-page/${projectId._id}`;
        const projectMembers = await userService.getAllUsersInProject(projectId);
        await Promise.all(projectMembers?.map(async (member) => {
            const memberId = new mongoose.Types.ObjectId(member._id);
            if(!memberId.equals(req.user._id)){
            await appService.addNotificationToDbSingle(req, member._id, teamId, `${req.user.firstName} ${req.user.lastName} edited project details`, projectLink);}
        }));
        res.json(project);
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const getUsersInTeamAndRoles = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const users = await userService.getAllUsersInOrganizationWithRoles(teamId);
        res.json(users);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
};



const getAllRolesInTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const roles = await appService.getAllRoles(teamId);
        res.json(roles);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const deleteRole = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const roleId = req.body.roleId;
        
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }

        await appService.deleteRole(roleId, teamId);
        const teamMembers = await userService.getAllUsersInTeam(teamId);
        await Promise.all(teamMembers?.map(async (member) => {
            const memberId = new mongoose.Types.ObjectId(member._id);
            if(!memberId.equals(req.user._id)){
                await appService.addNotificationToDbSingle(req, member._id, teamId, `${req.user.firstName} ${req.user.lastName} deleted a role`,);}
        }));
        res.json({ message: 'role deleted successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const getAllPermissions = async (req, res) => {
    try {
        const permissions = await appService.getAllPermissions()
        res.json(permissions)
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}




const addPermissionToRole = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const roleId = req.body.roleId;
        const projectId = req.body.projectId;
        const permissionId = req.body.permissionId;

        //permission check
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }

        await appService.addPermissionToRole(roleId, permissionId, projectId, teamId);
        res.json({ message: 'permission added to role successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const removePermissionFromRole = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const roleId = req.body.roleId;
        const projectId = req.body.projectId;
        const permissionId = req.body.permissionId;

        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }

        await appService.removePermissionFromRole(roleId, permissionId, projectId, teamId);
        res.json({ message: 'permission removed from role successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const getAllRolesWithPermissions = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;

        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }

        const roles = await appService.getAllRolesWithPermissions(teamId, projectId);
        res.json(roles);
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



const getUsersRolePermissionsInProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const userId = req.body.userId;

        const permissions = await userService.getUserRolePermissionsInProject(userId, projectId, teamId);
        res.json(permissions);
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}




const getUserInviteId = async (req, res) => {
    try {
        const user = await userService.getUserById(req.body.userId);
        if (user) {
            //check if password is set
            if (user.password == null) {
                res.json({ inviteId: user._id })
            } else {
                res.json({ message: 'already registered' })
            }
        } else {
            res.json({ message: 'not valid' })
        }
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

const getAllInvitesInTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        const users = await appService.getAllInvitedUsers(teamId);
        res.json(users);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
};



const addTicketToProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const userId = req.body.userId;
        const ticketName = req.body.ticketName;
        const ticketDescription = req.body.ticketDescription;
        const ticketType = req.body.ticketType;
        const ticketPriority = req.body.ticketPriority;
        const ticketStatus = req.body.ticketStatus;
        const ticketAssignTo = req.body.ticketAssignTo;
        const ticketReporter = req.body.ticketReporter;
        const ticketDueDate = req.body.ticketDueDate;
        const pinned = req.body.pinned;

        //check if user is in team
        const userInTeam = await userService.checkUserIsInOrganization(userId, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'user is not in team' });
        }
        
        //check if user is admin
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        const userInProject = await userService.checkUserIsInProject(userId, projectId);
        if (!userInProject && !adminCheck) {
            return res.status(401).json({ message: 'user is not in project nor admin' });
        }

        const userHasPermission = await userService.checkUserPermission(userId, teamId, projectId, "Edit");

        if(adminCheck || userHasPermission){
            const ticket = await appService.addTicketToProject(teamId, projectId, ticketName, ticketDescription, ticketType, ticketPriority, ticketStatus, ticketAssignTo, ticketReporter, ticketDueDate, pinned);
            const projectMembers = await userService.getAllUsersInProject(projectId);
            const projectMemberNotifications = projectMembers.map(async (member) => {
                await appService.addNotificationToDbSingle(req, member._id, teamId, `${req.user.firstName} ${req.user.lastName} added a ticket to the project`, `/ticket/${ticket._id}`);
            });
            
            const ticketAssignToNotifications = ticketAssignTo.map(async (member) => {
                await appService.addNotificationToDbSingle(req, member, teamId, `${req.user.firstName} ${req.user.lastName} assigned you to a ticket`, `/ticket/${ticket._id}`);
            });
            
            await Promise.all([...projectMemberNotifications, ...ticketAssignToNotifications]);
            res.json(ticket);
            
        }
        else{
            return res.status(401).json({ message: 'user does not have permission to add ticket' });
        }
        
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//admins  and users with "Edit" permission can edit ticket details
const editTicketDetails = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const userId = req.body.userId;
        const ticketId = req.body.ticketId;
        const ticketName = req.body.ticketName;
        const ticketDescription = req.body.ticketDescription;
        const ticketType = req.body.ticketType;
        const ticketPriority = req.body.ticketPriority;
        const ticketStatus = req.body.ticketStatus;
        const ticketAssignTo = req.body.ticketAssignTo;
        const ticketDueDate = req.body.ticketDueDate;
        const pinned = req.body.pinned;

        //check if user is in team
        const userInTeam = await userService.checkUserIsInOrganization(userId, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'user is not in team' });
        }
        //check if user is in project
        const userInProject = await userService.checkUserIsInProject(userId, projectId);
        if (!userInProject) {
            return res.status(401).json({ message: 'user is not in project' });
        }
        //check if user has permission to edit ticket || user is admin
        const userHasPermission = await userService.checkUserPermission(userId, teamId, projectId, "Edit");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!userHasPermission && !adminCheck) {
            return res.status(401).json({ message: 'user does not have permission to edit ticket' });
        }
        //edit ticket details
        const ticket = await appService.editTicketDetails(ticketId, ticketName, ticketDescription, ticketType, ticketPriority, ticketStatus, ticketAssignTo, ticketDueDate, pinned);
        
        await Promise.all(ticketAssignTo?.map(async (member) => {
            await appService.addNotificationToDbSingle(req, member, teamId, `${req.user.firstName} ${req.user.lastName} edited a ticket you are assigned to`, `/ticket/${ticket._id}`);
        }));
        
        res.json(ticket);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const pinAndUnpinTicket = async (req, res) => {
    try{
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const userId = req.body.userId;
        const ticketId = req.body.ticketId;
        const pinned = req.body.pinned;

       
        const userInTeam = await userService.checkUserIsInOrganization(userId, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'user is not in team' });
        }

        
        const userInProject = await userService.checkUserIsInProject(userId, projectId);
        if (!userInProject) {
            return res.status(401).json({ message: 'user is not in project' });
        }
        //check if user has permission to edit ticket || user is admin
        const userHasPermission = await userService.checkUserPermission(userId, teamId, projectId, "Edit");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!userHasPermission && !adminCheck) {
            return res.status(401).json({ message: 'you do not have the permission to edit or pin ticket' });
        }

        //pin and unpin ticket
        const ticket = await appService.pinAndUnpinTicket(ticketId, pinned);
        const projectMembers = await userService.getAllUsersInProject(projectId);
        const projectLink = typeof projectId === 'string' ? `/project-page/${projectId}` : `/project-page/${projectId._id}`;
        await Promise.all(projectMembers?.map(async (member) => {
            const memberId = new mongoose.Types.ObjectId(member._id);
            if(!memberId.equals(req.user._id)){
            await appService.addNotificationToDbSingle(req, member._id, teamId, `${req.user.firstName} ${req.user.lastName} ${pinned ? `pinned a ticket`: `unpinned a ticket`}`, projectLink);}
        }));
        res.json(ticket);
    }
    catch(error){
        errorHandler.errorHandler(error, res)
    }
}



const deleteTicketFromProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const userId = req.body.userId;
        const ticketId = req.body.ticketId;

      
        const userInTeam = await userService.checkUserIsInOrganization(userId, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'user is not in team' });
        }
        

        const userInProject = await userService.checkUserIsInProject(userId, projectId);
        if (!userInProject) {
            return res.status(401).json({ message: 'user is not in project' });
        }
        //check if user has permission to delete ticket || user is admin
        const userHasPermission = await userService.checkUserPermission(userId, teamId, projectId, "Delete");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!userHasPermission && !adminCheck) {
            return res.status(401).json({ message: 'user does not have permission to edit ticket' });
        }
        //delete ticket from project
        await appService.deleteTicketFromProject(ticketId);
        const projectMembers = await userService.getAllUsersInProject(projectId);
        const projectLink = typeof projectId === 'string' ? `/project-page/${projectId}` : `/project-page/${projectId._id}`;
        await Promise.all(projectMembers?.map(async (member) => {
            await appService.addNotificationToDbSingle(req, member._id, teamId, `${req.user.firstName} ${req.user.lastName} deleted a ticket`, projectLink);
        }));
        res.json({ message: 'ticket deleted successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}




const deleteProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        //permission check
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }

        //delete project
        await appService.deleteProject(projectId);
        const projectMembers = await userService.getAllUsersInProject(projectId);
        await Promise.all(projectMembers?.map(async (member) => {
            const memberId = new mongoose.Types.ObjectId(member._id);
            if(!memberId.equals(req.user._id)){
            await appService.addNotificationToDbSingle(req,member._id,  teamId, `${req.user.firstName} ${req.user.lastName} deleted a project`,);}
        }));
        res.json({ message: 'project deleted successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



const deleteTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        //permission check
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }

        //delete team
        await appService.deleteOrganization(teamId);
        const teamMembers = await userService.getAllUsersInTeam(teamId);
        await Promise.all(teamMembers?.map(async (member) => {
            const memberId = new mongoose.Types.ObjectId(member._id);
            if(!memberId.equals(req.user._id)){
                await appService.addNotificationToDbSingle(req,member._id,  teamId, `${req.user.firstName} ${req.user.lastName} deleted the team`)}
        }));
        res.json({ message: 'team deleted successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//check user admin (for frontend)
const checkUserIsAdmin = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const userId = req.body.userId;

        if (teamId == null || userId == null) {
            return res.status(400).json({ message: 'Both teamId and userId are required.' });
        }
        
        const isAdmin = await userService.checkUserIsAdmin(userId, teamId, res);
        res.json(isAdmin);
    } catch (error) {
        errorHandler.errorHandler(error, res);
    }
};






//get all users(remove later)
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//get all teams(remove later)
const getAllTeams = async (req, res) => {
    try {
        const teams = await appService.getAllOrganizations();
        res.json(teams);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

















module.exports = {
    inviteUser, getAllUsers, getAllTeams, createRole, addUserToRole, removeUserFromRole
    , editTeamDetails, removeUserFromTeam, createProject, addUserToProject, removeUserFromProject
    , getAllProjectsInTeam, getAllUsersInProject, getUsersInTeamAndRoles, getAllRolesInTeam, editProjectDetails, getTeamDetails,
    deleteRole, getAllPermissions, addPermissionToRole, getAllRolesWithPermissions, removePermissionFromRole,
    getUsersRolePermissionsInProject, getUserInviteId, getAllInvitesInTeam, addTicketToProject, editTicketDetails
    , deleteTicketFromProject, deleteProject, deleteTeam, checkUserIsAdmin,getUserInfoByEmail, pinAndUnpinTicket
}
