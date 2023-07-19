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
                return res.status(401).json(`user is already in team or has been invited`);
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
        const role = await appService.createRole(teamId, roleName);
        res.json(role);
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
            return res.status(401).json({ message: 'user already has a role in team' });
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
        const project = await appService.createProject(teamId, projectName, projectDescription);
        res.json(project);
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
        // check permissions
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //check if user is in team
        const userInTeam = await userService.checkUserIsInOrganization(userId, teamId);
        if (!userInTeam) {
            return res.status(401).json({ message: 'user is not in team' });
        }
        //check if user is already in project
        const userInProject = await userService.checkUserIsInProject(userId, projectId);
        if (userInProject) {
            return res.status(401).json({ message: 'user is already in project' });
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
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
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
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        //permission check
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //get all users in project
        const users = await userService.getAllUsersInProject(projectId);
        res.json(users);
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//edit project details
const editProjectDetails = async (req, res) => {
    try{
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const projectName = req.body.projectName;
        const projectDescription = req.body.projectDescription;
        //permission check
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!adminCheck) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
        //edit project details
        const project = await appService.editProjectDetails(projectId, projectName, projectDescription);
        res.json(project);
    }
    catch(error){
        errorHandler.errorHandler(error, res)
    }
}

// get all users in an organization and their roles
const getUsersInTeamAndRoles= async (req, res) => {
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



// //get user invite id
// const getUserInviteId = async (req, res) => {
//     try {
//         const user = await userService.getUserById(req.body.userId);
//         if (user) {
//             //check if password is set
//             if (user.password == '') {
//                 res.json({ inviteId: user._id })
//             } else {
//                 //if password is set, redirect to login page
//                 res.json({ message: 'already registered' })
//             }
//         } else {
//             //if invite id does not exist, redirect to login page
//             res.json({ message: 'not valid' })
//         }
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// }

// //get all invited users in an organization yet to accept invitation
// const getInvitedUsersInOrganization = async (req, res) => {
//     try {
//         const adminUser = req.user;
//         const organization = await userService.getUserOrganization(adminUser.phoneNumber);//get Admin user's organization
//         const users = await adminService.getAllUsersWithEmptyPassword(organization);
//         res.json(users);
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };


module.exports = {
    inviteUser, getAllUsers, getAllTeams, createRole, addUserToRole, removeUserFromRole
    , editTeamDetails, removeUserFromTeam, createProject, addUserToProject, removeUserFromProject
    ,getAllProjectsInTeam, getAllUsersInProject, getUsersInTeamAndRoles, getAllRolesInTeam, editProjectDetails, getTeamDetails
}
