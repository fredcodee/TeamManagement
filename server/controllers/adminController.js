const errorHandler = require('../configs/errorHandler')
const userService = require('../services/userServices')
const appService = require('../services/appServices')




//invite users to team
const inviteUser = async (req, res) => {
    try {
        const email = req.body.email;
        const teamId = req.body.teamId;

        // check permissions
        await checkUserIsAdmin(req.user, teamId, res);


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
        await checkUserIsAdmin(req.user, teamId, res);
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
        await checkUserIsAdmin(req.user, teamId, res);
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
        await checkUserIsAdmin(req.user, teamId, res);
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


//edit team details
const editTeamDetails = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const teamName = req.body.teamName;
        // check permissions
        await checkUserIsAdmin(req.user, teamId, res);
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
        await checkUserIsAdmin(req.user, teamId, res);
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
        await checkUserIsAdmin(req.user, teamId, res);
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
        await checkUserIsAdmin(req.user, teamId, res);
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
        await checkUserIsAdmin(req.user, teamId, res);
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


//get all projects in teamcd
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
        await checkUserIsAdmin(req.user, teamId, res);
        //get all users in project
        const users = await userService.getAllUsersInProject(projectId);
        res.json(users);
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



//check if user is admin
const checkUserIsAdmin = async (user, teamId, res) => {
    try {
        const userIsAdmin = await userService.checkUserIsAdmin(user._id, teamId);
        if (!userIsAdmin) {
            return res.status(401).json({ message: 'user is not an admin' });
        }
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

// const removeUserAccount = async (req, res) => {
//     try {
//         const phoneNumber = req.body.phoneNumber;
//         const adminUser = req.user;
//         const organization = await userService.getUserOrganization(adminUser.phoneNumber);//get Admin user's organization

//         //check if user already exists
//         const userExists = await userService.checkUserExistsInDb(phoneNumber);
//         if (!userExists) {
//             res.status(406).json({message: 'User does not exist'});
//         }else{
//             //remove user from keycloak realm
//             const token = await keycloak.connectToAdminCLI();
//             await keycloak.deleteUserFromKeycloak(organization.name, phoneNumber, token.data.access_token);
//             //remove user from localdb
//             await adminService.deleteUserFromDb(phoneNumber);
//             res.json({message: 'User Account removed successfully'});
//         }
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };


// const createProject = async (req, res) => {
//     try {
//         const name = req.body.name;
//         const info = req.body.info;
//         const adminUser = req.user;
//         const organization = await userService.getUserOrganization(adminUser.phoneNumber);//get Admin user's organization

//         //check if project already exists in keycloak realm and localdb
//         const token = await keycloak.connectToAdminCLI();
//         const projectExists = await adminService.checkProjectExistsInDb(name);
//         const checkProjectExistsInKeycloakAndCreate = await keycloak.createClient( organization.name, name, token.data.access_token);
//         if (!projectExists && checkProjectExistsInKeycloakAndCreate) {
//             await adminService.addNewProjectToDb(name, info, organization);
//             res.json({message: 'Project created successfully'});
//         }else{
//             res.status(406).json({message: 'Project already exists'});
//         }
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };


// const createProjectRole = async (req, res) => {
//     try {
//         const projectId = req.body.projectId;
//         let role = req.body.roleName;
//         role = toTitleCase(role);
//         const adminUser = req.user;
//         const organization = await userService.getUserOrganization(adminUser.phoneNumber);//get Admin user's organization
//         const project = await adminService.getProjectById(projectId);

//         if (project) {         
//             //check if project role already exists in keycloak realm and localdb
//             const token = await keycloak.connectToAdminCLI();
//             const projectRoleExists = await adminService.checkProjectRoleExistsInDb(role , project);
//             const checkProjectRoleExistsInKeycloakAndCreate = await keycloak.createRoleInClient(organization.name,project.name, role, token.data.access_token);
//             if (!projectRoleExists && checkProjectRoleExistsInKeycloakAndCreate) {
//                 await adminService.addNewProjectRoleToDb(role, project, organization);
//                 res.json({message: `${role} created in ${project.name} successfully`});
//             }else{
//                 res.status(406).json({message: `${role} already exists in ${project.name}`});
//             }
//         }else{
//             res.status(406).json({message: `${project.name} does not exist`});
//         }
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };

// //invite user to project
// const addUserToProject = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const projectId = req.body.projectId;
//         let role = req.body.role || 'reader';
//         role = toTitleCase(role);

//         const adminUser = req.user;
//         const user = await userService.getUserById(userId);
//         const organization = await userService.getUserOrganization(adminUser.phoneNumber);//get Admin user's organization
//         const project = await adminService.getProjectById(projectId);
//         //add user to project
//         const addUserToProject = await adminService.addUserToProject(user._id, project._id, role);
//         if (!addUserToProject){
//             res.status(406).json({message: 'User already exists in project'});
//         }
//         else if(addUserToProject){
//             //add assign user a project role(keycloak and localdb)
//             const token = await keycloak.connectToAdminCLI();
//             const assignProjectRoleKeycloak = await keycloak.assignClientRoleToUser(organization.name, project.name, user.phoneNumber, role, token.data.access_token);
//             const assignProjectRoleDb = await adminService.assignProjectRoleToUser(user, project, role);
//             //send sms to user/ notification
//             res.json({message: `User added to ${project.name} successfully`});
//         }
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };





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

// //asign project roles to user
// const assignProjectRoleToUser = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const projectId = req.body.projectId;
//         let role = req.body.role
//         role = toTitleCase(role);
//         const adminUser = req.user;
//         const user = await userService.getUserById(userId);
//         const organization = await userService.getUserOrganization(adminUser.phoneNumber);//get Admin user's organization
//         const project = await adminService.getProjectById(projectId);

//         //add assign user a project role(keycloak and localdb)
//         const token = await keycloak.connectToAdminCLI();
//         const assignProjectRoleKeycloak = await keycloak.assignClientRoleToUser(organization.name, project.name, user.phoneNumber, role, token.data.access_token);
//         const assignProjectRoleDb = await adminService.assignProjectRoleToUser(user, project, role);
//         //send sms to user || notification
//         res.json({ message: `asigned ${user.firstName} as ${role} in ${project.name}` });
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };


// //unassign project roles from user
// const unassignProjectRoleFromUser = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const projectId = req.body.projectId;
//         let role = req.body.role
//         role = toTitleCase(role);

//         const adminUser = req.user;
//         const user = await userService.getUserById(userId);
//         const organization = await userService.getUserOrganization(adminUser.phoneNumber);//get Admin user's organization
//         const project = await adminService.getProjectById(projectId);

//         //add unassign user from a project role(keycloak and localdb)
//         const token = await keycloak.connectToAdminCLI();
//         const unassignProjectRoleKeycloak = await keycloak.unassignUserFromClientRole(organization.name, project.name, user.phoneNumber, role, token.data.access_token);
//         const unassignProjectRoleDb = await adminService.removeUserFromRole(user, project, role);
//         //send sms to user || notification
//         res.json({ message: `removed ${user.firstName} as ${role} in ${project.name}` });
//     } catch (error) {
//         errorHandler.errorHandler(error, res)

//     }
// };

// //get all roles in a project
// const getProjectRoles = async (req, res) => {
//     try {
//         const projectId = req.body.projectId;
//         const project = await adminService.getProjectById(projectId);
//         const roles = await adminService.getProjectRoles(project);
//         res.json(roles);
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };

// //get all user and their roles in a project
// const getUsersAndTheirRolesInProject = async (req, res) => {
//     try {
//         const projectId = req.body.projectId;
//         const project = await adminService.getProjectById(projectId);
//         const users = await adminService.getUsersAndTheirRolesInProject(project._id);
//         res.json(users);
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };


// //delete organization
// const deleteOrganization = async (req, res) => {
//     try {
//         const adminUser = req.user;
//         const organization = await userService.getUserOrganization(adminUser.phoneNumber);//get Admin user's organization
//         const organization_users = await userService.getAllUsersInOrganization(organization);
//         const projects = await adminService.getAllProjectsInOrganization(organization);
//         const roles = await adminService.getAllRolesInOrganization(organization);

//         //delete keycloak organization(realm) &  from local db
//         const token = await keycloak.connectToAdminCLI();
//         const deleteKeycloakOrganization = await keycloak.deleteOrganization(organization.name, token.data.access_token);
//         const deleteOrganizationFromDb = await adminService.deleteOrganization(organization);
//         res.json({ message: `Organization deleted successfully` });
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// };

// // delete project (and its roles & its role_table)
// // delete project roles(unasign users from the roles)


// //funcs
// function toTitleCase(str) {
//     return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   }


module.exports = {
    inviteUser, getAllUsers, getAllTeams, createRole, addUserToRole, removeUserFromRole
    , editTeamDetails, removeUserFromTeam, createProject, addUserToProject, removeUserFromProject
    ,getAllProjectsInTeam, getAllUsersInProject, getUsersInTeamAndRoles
}
