const Organization = require('../models/Organization');
const Project = require('../models/Project');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRoles = require('../models/UserRoles');

// add new organization to db
async function addNewOrganizationToDb (name){
    try {
        const organization = new Organization(
            {name:name}
        );
        await organization.save();
    } catch (error) {
        throw new Error(`Cant Add Organization to DB ${error}`);
    }
};


//create a function to check in an organization exists in db
async function checkOrganizationExistsInDb (name){
    try {
        const result = await Organization.findOne({name});
        if (result) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(`Organization doesnt exist in the db ${error}`);
    }
}

//add new user to db
async function addNewUserToDb (firstName,lastName, password, organization, phoneNumber, admin){
    try {
        //get organization id
        const organizationId = await Organization.findOne({name:organization});
        const user = new User(
            {firstName:firstName,lastName:lastName, password:password, organization_id:organizationId ,phoneNumber:phoneNumber, organization_admin:admin}
        );
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Cant Add User to DB ${error}`);
    }
};


//delete user from db
async function deleteUserFromDb (phoneNumber){
    try {
        const deletedUser = await User.findOneAndDelete({phoneNumber:phoneNumber});
        // remove  user from all  roles 
        const userRoles = await UserRoles.find({ user_id: deletedUser._id });
        await UserRoles.deleteMany({ user_id: deletedUser._id });
        return true;
    } catch (error) {
        throw new Error(`Cant delete user from DB ${error}`);
    }
};


//add new project to db
async function addNewProjectToDb (name, info, organization){
    try {
        const newProject = new Project(
            {name:name, info:info, organization_id:organization}
        );
        await newProject.save();
    } catch (error) {
        throw new Error(`Cant Add Project to DB ${error}`);
    }
};   

// check if project exists
async function checkProjectExistsInDb (name){
    const project = await Project.findOne({name: name });
    if (project) {
        return true;
    }
    return false;
}

//get project
async function getProjectById (projectId){
    try {
        const project  = await Project.findOne({_id:projectId});
        return project;
    } catch (error) {
        throw new Error(`Cant get project ${error}`);
    }
}


//add new role to db
async function addNewProjectRoleToDb (name, Project, organization){
    try {
        const newRole = new Role(
            {name:name, project_id:Project, organization_id:organization}
        );
        await newRole.save();
    } catch (error) {
        throw new Error(`Cant Add Role to DB ${error}`);
    }
};


//check if role exists
async function checkProjectRoleExistsInDb(name, project) {
    const role = await Role.findOne({ name: name , project_id:project._id} );
    if (role) {
        return true;
    }
    return false;
};



// add user to a project
async function addUserToProject (userId, projectId, roleName){
    try {
        const user = await User.findById(userId);
        if (user.projects.includes(projectId)) {
            return false;
        }
        user.projects.push(projectId);
        await user.save();
        return true;
    } catch (error) {
        return false;
    }
}

// assign user to a role
async function assignProjectRoleToUser(user, project, roleName) {
    try {
        //get or create role
        const roleExists = await checkProjectRoleExistsInDb(roleName, project);
        if (!roleExists) {
            await addNewProjectRoleToDb(roleName, project, user.organization_id);
        }
        const role = await Role.findOne({ name: roleName});
        // Check if user already has a role assigned to them for this project
        const existingUserRole = await UserRoles.findOne({ user_id: user._id, project_id: project._id });

        if (existingUserRole) {
            // User already has a role assigned to them for this project
            if (existingUserRole.role_id.equals(role._id)) {
                return;
            } else {
                // Unassign user from the old role
                await UserRoles.deleteOne({ _id: existingUserRole._id });
            }
        }

        // Assign user to the new role
        const newUserRole = new UserRoles({
            user_id: user,
            role_id: role,
            project_id: project
        });
        await newUserRole.save();

        return true;
    } catch (error) {
        return false;
    }
}

//get all roles for a project
async function getProjectRoles(project) {
    try {
        //get all roles 
        const allRoles = await Role.find({ project_id: project._id});
        return allRoles;
    } catch (error) {
        throw new Error(`Cant get roles for project ${error}`);
    }
}

//remove user from a role *also remove users from a project
async function removeUserFromRole(user, project, roleName) {
    try {
        //check if role exists and if user has that role
        const roleExists = await checkProjectRoleExistsInDb(roleName, project);
        const existingUserRole = await UserRoles.findOne({ user_id: user._id, project_id: project._id });
        if (!roleExists || !existingUserRole) {
            return false;
        }
        //remove user from role and also remove user from project
        await UserRoles.deleteOne({ _id: existingUserRole._id });
        await removeUserFromProject(user._id, project._id);
        return true;
    } catch (error) {
        return false;
    }
}   

// func to remove user from a project
async function removeUserFromProject(userId, projectId) {
    try {
      const user = await User.findById(userId);
      if (!user.projects.includes(projectId)) {
        return false;
      }
      user.projects.pull(projectId);
      await user.save();
      return true;
    } catch (error) {
      return false;
    }
  }
  

//get all user and their roles in a project
async function getUsersAndTheirRolesInProject(projectId) {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
  
      const userRoles = await UserRoles.find({ project_id: projectId })
        .populate({ path: "user_id", select: "firstName lastName phoneNumber" })
        .populate({ path: "role_id", select: "name" })
        .exec();
  
      return userRoles;
    } catch (error) {
      throw new Error(error.message);
    }
  };

//get all user with password == '' //invited users yet to register
async function getAllUsersWithEmptyPassword( organization){
    try {
        const users = await User.find({organization_id:organization, password:''});
        return users;
    } catch (error) {
        throw new Error(`Cant get users ${error}`);
    }
}

   




module.exports = { addNewOrganizationToDb, checkOrganizationExistsInDb, addNewUserToDb, deleteUserFromDb
, addNewProjectToDb, checkProjectExistsInDb, getProjectById, addNewProjectRoleToDb, checkProjectRoleExistsInDb
, addUserToProject, assignProjectRoleToUser, getAllUsersWithEmptyPassword, removeUserFromRole,getProjectRoles
, getUsersAndTheirRolesInProject}
