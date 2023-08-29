const errorHandler = require('../configs/errorHandler')
const userService = require('../services/userServices')
const appService = require('../services/appServices')




//invite users to team
const inviteUser = async (req, res) => {
    try {
        const email = req.body.email;
        const teamId = req.body.teamId;

        // check permissions
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
        // if user does not exist, invite user
        const inviteId = await appService.inviteUserToOrganization(email, teamId);
        //retun invite id
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
        // check permissions
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
        // check permissions
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
        res.json({ message: 'user added to role successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//remove user from role
const removeUserFromRole = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const userId = req.body.userId;
        const roleId = req.body.roleId;
        // check permissions
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
        res.json({ message: 'user removed from role successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//get team details
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



//edit team details
const editTeamDetails = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const teamName = req.body.teamName;
        // check permissions
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //edit team details
        await appService.editOrganizationDetails(teamId, teamName);
        res.json({ message: 'team details edited successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//remove user from team
const removeUserFromTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const userId = req.body.userId;
        // check permissions
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //remove user from team
        await appService.removeUserFromOrganization(userId, teamId);
        res.json({ message: 'user removed from team successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//create project
const createProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectName = req.body.projectName;
        const projectDescription = req.body.projectDescription;
        // check permissions
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
// get user info by email

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
        // check permissions
        const userHasPermission = await userService.checkUserPermission(userId, teamId, projectId, "Remove");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck && !userHasPermission) {
            return res.status(401).json({ message: 'user does not have permission to remove user' });
        }
        //check if user is in team
        const userInTeam = await userService.checkUserIsInOrganization(userId, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'user is not in team' });
        }
        //check if user is already in project
        const userInProject = await userService.checkUserIsInProject(userId, projectId);
        if (!userInProject) {
            return res.status(401).json({ message: 'user is not in project' });
        }
        //remove user from project
        await appService.removeUserFromProject(userId, projectId);
        res.json({ message: 'user removed from project successfully' });

    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//get all projects in team
const getAllProjectsInTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        //check if user is in team
        const userInTeam = await userService.checkUserIsInOrganization(req.user._id, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'access denied user is not in team' });
        }
        //get all projects in team
        const projects = await appService.getAllProjects(teamId);
        res.json(projects);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

// get all users in a project
const getAllUsersInProject = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const users = await userService.getAllUsersInProject(projectId);
        res.json(users);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//edit project details
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
        res.json(project);
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

// get all users in an organization and their roles
const getUsersInTeamAndRoles = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const users = await userService.getAllUsersInOrganizationWithRoles(teamId);
        res.json(users);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
};


//get all roles in an organization/team
const getAllRolesInTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const roles = await appService.getAllRoles(teamId);
        res.json(roles);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//delete roles in an organization/team
const deleteRole = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const roleId = req.body.roleId;
        
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }

        await appService.deleteRole(roleId, teamId);
        res.json({ message: 'role deleted successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//get all pesmissions
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await appService.getAllPermissions()
        res.json(permissions)
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



// (only admins) add permission to role
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
        //add permission to role
        await appService.addPermissionToRole(roleId, permissionId, projectId, teamId);
        res.json({ message: 'permission added to role successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

// (only admins) remove permission from role
const removePermissionFromRole = async (req, res) => {
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
        //remove permission from role
        await appService.removePermissionFromRole(roleId, permissionId, projectId, teamId);
        res.json({ message: 'permission removed from role successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//(only admins)  view all roles with permissions in an organization/team
const getAllRolesWithPermissions = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        //permission check
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //get all roles with permissions
        const roles = await appService.getAllRolesWithPermissions(teamId, projectId);
        res.json(roles);
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//get users role persmissions in a project
const getUsersRolePermissionsInProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const userId = req.body.userId;
        //get users role permissions in project
        const permissions = await userService.getUserRolePermissionsInProject(userId, projectId);
        res.json(permissions);
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



// //get user invite id
const getUserInviteId = async (req, res) => {
    try {
        const user = await userService.getUserById(req.body.userId);
        if (user) {
            //check if password is set
            if (user.password == null) {
                res.json({ inviteId: user._id })
            } else {
                //if password is set, redirect to login page
                res.json({ message: 'already registered' })
            }
        } else {
            //if invite id does not exist, redirect to login page
            res.json({ message: 'not valid' })
        }
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//get all invited users in an organization yet to accept invitation
const getAllInvitesInTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        //permission check
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

//admin users and user with "Edit" permission can add tickets to a project
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
            const ticket = await appService.addTicketToProject(projectId, ticketName, ticketDescription, ticketType, ticketPriority, ticketStatus, ticketAssignTo, ticketReporter, ticketDueDate, pinned);
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
        res.json(ticket);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//delete ticket from project
const deleteTicketFromProject = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const userId = req.body.userId;
        const ticketId = req.body.ticketId;

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
        //check if user has permission to delete ticket || user is admin
        const userHasPermission = await userService.checkUserPermission(userId, teamId, projectId, "Delete");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!userHasPermission && !adminCheck) {
            return res.status(401).json({ message: 'user does not have permission to edit ticket' });
        }
        //delete ticket from project
        await appService.deleteTicketFromProject(ticketId);
        res.json({ message: 'ticket deleted successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



//delete project
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
        res.json({ message: 'project deleted successfully' });
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//delete team
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
        // Permission check
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
    , deleteTicketFromProject, deleteProject, deleteTeam, checkUserIsAdmin,getUserInfoByEmail 
}
