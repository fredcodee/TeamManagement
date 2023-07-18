const userService = require('./userServices');
const Organization = require('../models/Organization');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRoles = require('../models/UserRoles');
const Project = require('../models/Project');




//create organization/team
async function createOrganization(name) {
    try {
        //check if organization exists and return "organization already exists" if it does
        const organization = await Organization.findOne({ name: name })
        if (organization) {
            throw new Error(`Sorry a team with this name already exists`);
        }
        const newOrganization = new Organization({
            name: name,
        });
        await newOrganization.save();
        return newOrganization;
    } catch (error) {
        throw new Error(`Cant create organization ${error}`);
    }
}

//add organization to user
async function addOrganizationToUser(userId, organizationId) {
    try {
        const user = await User.findById(userId);
        const team = await Organization.findById(organizationId);
        if (user) {
            // Check if the organization_id field is null and initialize it as an empty array if needed
            if (!user.organization_id) {
                user.organization_id = [];
              }
            // Add the organization ID to the user's organization_id array
            user.organization_id.push(team._id);
            await user.save();
            return true;
      }
    }
    catch (error) {
        throw new Error(`Cant add organization to user db ${error}`);
      }
    }

//create role
async function createRole(organizationId, roleName) {
    try {
        const role = new Role({
            name: roleName,
            organization_id: organizationId
        });
        await role.save();
        return role;
    } catch (error) {
        throw new Error(`Cant create role ${error}`);
    }
}

//add user to role
async function addUserToRole(userId, roleId, organizationId) {
    try {
        const userRole = new UserRoles({
            user_id: userId,
            role_id: roleId,
            organization_id: organizationId
        });

        await userRole.save();
        return userRole;
    } catch (error) {
        throw new Error(`Cant add user to role ${error}`);
    }
}

//remove user from role
async function removeUserFromRole(userId, roleId, organizationId) {
    try {
        await UserRoles.findOneAndDelete({ user_id: userId, role_id: roleId, organization_id: organizationId });
        return true;
    } catch (error) {
        throw new Error(`Cant remove user from role ${error}`);
    }
}


//invite user to organization/team
async function inviteUserToOrganization(email, organizationId) {
    try {
        //add user to db
        const user = await userService.addUserToDb(null,null,email,null);
        //add organization to user
        await addOrganizationToUser(user._id, organizationId);

        return user._id;
    } catch (error) {
        throw new Error(`Cant invite user to organization ${error}`);
    }
}

// check if user has role in organization
async function checkUserHasRoleInOrganization(userId, organizationId) {
    try {
        const userRole = await UserRoles.findOne({ user_id: userId, organization_id: organizationId });
        return !!userRole;
    } catch (error) {
        throw new Error(`Cant check if user has role in organization ${error}`);
    }
}
//edit organization/team details
async function editOrganizationDetails(teamId, name) {
    try {
        const team  = await Organization.findById(teamId);
        team.name = name;
        await team.save();
        return team;
    } catch (error) {
        throw new Error(`Cant edit organization details ${error}`);
    }
}

//remove user from organization/team
async function removeUserFromOrganization(userId, organizationId) {
    try {
        //remove user from organization
        await User.findOneAndUpdate({ _id: userId }, { $pull: { organization_id: organizationId } });
        //remove user from all roles in organization
        await UserRoles.deleteMany({ user_id: userId, organization_id: organizationId });
        return true;
    } catch (error) {
        throw new Error(`Cant remove user from organization ${error}`);
    }
}


//create project
async function createProject(organizationId, name, info) {
    try {
        const project = new Project({
            name: name,
            organization_id: organizationId,
            info: info
        });
        await project.save();
        return project;
    } catch (error) {
        throw new Error(`Cant create project ${error}`);
    }
}

//add user to project
async function addUserToProject(userId, projectId) {
    try {
        const user = await User.findById(userId);
        const project= await Project.findById(projectId);
        if (user) {
            // Add the organization ID to the user's organization_id array
            user.projects.push(project._id);
            await user.save();
            return true;
      }
    }
    catch (error) {
        throw new Error(`Cant add user to project ${error}`);
      }
    }

//remove user from project
async function removeUserFromProject(userId, projectId) {
    try {
        await User.findOneAndUpdate({ _id: userId }, { $pull: { projects: projectId } });
        return true;
    } catch (error) {
        throw new Error(`Cant remove user from project ${error}`);
    }
}


//get all organization/team projects
async function getAllProjects(organizationId) {
    try {
        const projects = await Project.find({ organization_id: organizationId });
        return projects;
    } catch (error) {
        throw new Error(`Cant get projects ${error}`);
    }
}

//get all roles in organization/team
async function getAllRoles(organizationId) {
    try {
        const roles = await Role.find({ organization_id: organizationId });
        return roles;
    } catch (error) {
        throw new Error(`Cant get roles ${error}`);
    }
}









//get all team (remove later)
async function getAllOrganizations() {
    try {
        const organizations = await Organization.find();
        return organizations;
    } catch (error) {
        throw new Error(`Cant get organizations ${error}`);
    }
}





module.exports = {
    createOrganization, addOrganizationToUser, createRole, addUserToRole, inviteUserToOrganization,
    getAllOrganizations, checkUserHasRoleInOrganization, removeUserFromRole, editOrganizationDetails
    , removeUserFromOrganization, createProject, addUserToProject, removeUserFromProject, getAllProjects
    , getAllRoles
}