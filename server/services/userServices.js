const bcrypt = require('bcrypt')
const Organization = require('../models/Organization');
const User = require('../models/User');
const Project = require('../models/Project');
const Role = require('../models/Role');
const UserRoles = require('../models/UserRoles');
const config = require('../configs/config');
const jwt = require('jsonwebtoken')
const Permission = require('../models/Permissions');
const rolePermissions = require('../models/Role_Permissions');
const  Ticket = require('../models/Ticket');

//generate token
async function generateToken(user) {
    try {
        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '5d' });
        return token;
    }
    catch (error) {
        throw new Error(`Cant generate token ${error}`);
    }

}

//add user to db
async function addUserToDb(firstName, lastName, email, password) {
    try {
        if (password != null) {
           password = bcrypt.hashSync(password, 10)
        }
        const user = new User({
            firstName: firstName || null,
            lastName: lastName  || null,
            email: email || null,
            password: password || null,
            organization_id: null,
        });
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Cant add user to db ${error}`);
    }
}

// check if user exists and verify in db
async function findAndVerifyUser(email, password) {
    try {
        const user = await User.findOne({ email: email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return false;
        }

        return user;
    } catch (error) {
        throw new Error(`Cant find and verify user ${error}`);
    }
}

//edit user profile
async function editUserProfile(firstName, lastName, email, password) {
    try {
        await User.updateOne({ email: email }, {
            $set: {
                firstName: firstName,
                lastName: lastName,
                password: bcrypt.hashSync(password, 10)
            }
        })
        return true;
    } catch (error) {
        throw new Error(`Cant edit user profile ${error}`);
    }
}

//check if new user was innvited
async function checkIfUserWasInvited(email) {
    try {
        //invited users has only email and organization id
        const user = await User.findOne({ email: email });
        if ( user && user.organization_id != null && user.password == null) {
            return true;
        }
        return false;

    } catch (error) {
        throw new Error(`Cant check if user was invited ${error}`);
    }
}

//check if user is already registered
async function checkIfUserIsRegistered(email) {
    try {
        const user = await User.findOne({ email: email });
        if (user && user.password != null) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(`Cant check if user is registered ${error}`);
    }
}

//get user details
async function getUserById(id) {
    try {
        const user = User.findById(id);
        return user;
    } catch (error) {
        throw new Error(`Cant get user details ${error}`);
    }
}

//get user by email
async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email });
        if (user){
            return user
        }
        return false;
    } catch (error) {
        throw new Error(`Cant get user details ${error}`);
    }
}

//check if user is admin
async function checkUserIsAdmin(userId, organizationId) {
    try {
        const user = await UserRoles.findOne({ user_id: userId, organization_id:organizationId });
        const role = await Role.findById(user.role_id);
        if (role.name == 'admin') {
            return true;
        }
        return false;
    }
    catch (error) {
        return false
    }
}

//check user's role permission
async function checkUserPermission(userId, organizationId,projectId, permissionName) {
    try {
        const user = await UserRoles.findOne({ user_id: userId, organization_id:organizationId });
        const role = await Role.findById(user.role_id);
        const rolePermission = await rolePermissions.findOne({ role_id: role._id, project_id: projectId, organization_id: organizationId });
        const permission = await Permission.findById(rolePermission.permission_id);
        if (permission.name == permissionName) {
            return true;
        }
        return false;
    }
    catch (error) {
        return false
    }
}




//check if user is in orgamization/team
async function checkUserIsInOrganization(userId, organizationId) {
    try {
        const user = await User.findOne({_id: userId, organization_id: organizationId});
        return !!user;}
    catch (error) {
        return false
    }
}

//check if user is in project
async function checkUserIsInProject(userId, projectId) {
    try {
        const user = await User.findOne({_id: userId, projects: projectId});
        return !!user;}
    catch (error) {
        return false
    }
}

async function getAllUsersInOrganizationWithRoles(organizationId) {
    try {
      const allUser = await User.find({ organization_id: organizationId });
      const allUserWithRoles = [];
      
      for (let i = 0; i < allUser.length; i++) {
        const user = allUser[i];
        const userRole = await UserRoles.findOne({ user_id: user._id, organization_id: organizationId });
        const role = userRole ? await Role.findById(userRole.role_id) : { name: "no role" };
        const userWithRole = {
          user: user,
          role: role
        };
        allUserWithRoles.push(userWithRole);
      }
      
      return allUserWithRoles;
    } catch (error) {
      throw new Error(`Can't get all users in an organization: ${error}`);
    }
  }
  

//get user team
async function getUserTeamInfo(userId){
    try{
        const teams = []
        const team  = await User.findOne({ _id: userId }).populate('organization_id');
        for (const organization of team.organization_id) {
            const team = {
                teamId: organization._id,
                teamName: organization.name
            }
            teams.push(team)
        }
        return teams;
    }
    catch(error){
        return false
    }
}


// get all users(remove later)
async function getAllUsers() {
    try {
        const allUser = await User.find();
        return allUser;
    } catch (error) {
        throw new Error(`Cant get all users ${error}`);
    }
}

// get all users in a project
async function getAllUsersInProject(projectId) {
    try {
        const allUser = await User.find({ projects: projectId });
        return allUser;
    } catch (error) {
        throw new Error(`Cant get all users in a project ${error}`);
    }
}

// get a user's projects
async function getUserProjects(userId) {
    try {
        const userProject = await User.findById(userId).populate('projects');
        return userProject.projects;
    } catch (error) {
        throw new Error(`Cant get user projects ${error}`);
    }
}

//get user's role permissions in a project
async function getUserRolePermissionsInProject(userId, projectId) {
    try {
        const user = await UserRoles.findOne({ user_id: userId, project_id: projectId });
        const role = await Role.findById(user.role_id);
        const rolePermission = await rolePermissions.find({ role_id: role._id, project_id: projectId });
        const permissions = [];
        for (const permission of rolePermission) {
            const permissionName = await Permission.findById(permission.permission_id);
            permissions.push(permissionName);
        }
        return permissions;
    } catch (error) {
        throw new Error(`Cant get user role permissions in a project ${error}`);
    }
}


//get user tickets in a project they ones they created
async function getUserTicketsInProject(userId, projectId) {
    try {
        const tickets = await Ticket.find({ created_by: userId, project_id: projectId });
        return tickets;
    } catch (error) {
        throw new Error(`Cant get user tickets in a project ${error}`);
    }
}


//get tickets assigned to user in a project
async function getTicketsAssignedToUserInProject(userId, projectId) {
    try {
        const tickets = await Ticket.find({ assigned_to: userId, project_id: projectId });
        return tickets;
    } catch (error) {
        throw new Error(`Cant get tickets assigned to user in a project ${error}`);
    }
}


// get all tickets assigned to user in all projects
async function getAllTicketsAssignedToUserinAllProject(userId) {
    try {
        const tickets = await Ticket.find({ assigned_to: userId });
        //sort tickets by date and get only first 5
        tickets.sort((a, b) => b.created_at - a.created_at);
        tickets.splice(5);
        return tickets;
    } catch (error) {
        throw new Error(`Cant get all tickets assigned to user in all projects ${error}`);
    }
}

//count members in a team
async function countMembersInTeam(teamId) {
    try {
        const members = await User.find({ organization_id: teamId });
        return members.length;
    } catch (error) {
        throw new Error(`Cant count members in a team ${error}`);
    }
}


        



module.exports = {
    generateToken, addUserToDb, findAndVerifyUser, getUserById, editUserProfile, getAllUsersInOrganizationWithRoles, checkUserIsAdmin
    , checkIfUserWasInvited, checkIfUserIsRegistered, getUserByEmail, checkUserIsInOrganization, getAllUsers
    , checkUserIsInProject, getAllUsersInProject, getUserProjects, getUserTeamInfo, checkUserPermission, getUserRolePermissionsInProject, getTicketsAssignedToUserInProject, getUserTicketsInProject
, getAllTicketsAssignedToUserinAllProject, countMembersInTeam
}