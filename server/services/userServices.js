const bcrypt = require('bcrypt')
const Organization = require('../models/Organization');
const User = require('../models/User');
const Project = require('../models/Project');
const Role = require('../models/Role');
const UserRoles = require('../models/UserRoles');
const config = require('../configs/config');
const jwt = require('jsonwebtoken')


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



// get all users(remove later)
async function getAllUsers() {
    try {
        const allUser = await User.find();
        return allUser;
    } catch (error) {
        throw new Error(`Cant get all users ${error}`);
    }
}


//get all users in a organization and their roles
async function getAllUsersInOrganizationWithRoles(organizationId) {
    try {
        const allUser = await User.find({ organization_id: organizationId });
        const allUserWithRoles = [];
        for (let i = 0; i < allUser.length; i++) {
            const user = allUser[i];
            const userRole = await UserRoles.findOne({ user_id: user._id, organization_id: organizationId });
            const role = await Role.findById(userRole.role_id);
            const userWithRole = {
                user: user,
                role: role
            }
            allUserWithRoles.push(userWithRole);
        }
        return allUserWithRoles;
    } catch (error) {
        throw new Error(`Cant get all users in an organization ${error}`);
    }
}



//---------------------------------------------------------------

//get user's organization
async function getUserOrganization(email) {
    try {
        const user = await User.findOne({ email: email });
        const UserOrganizationDetails = await Organization.findById(user.organization_id);
        return UserOrganizationDetails;
    } catch (error) {
        return false
    }
}

//get user by phone number
async function getUserByPhoneNumber(phoneNumber) {
    try {
        const user = User.findOne({ phoneNumber: phoneNumber });
        return user;
    } catch (error) {
        throw new Error(`Cant get user details ${error}`);
    }
}



// check if user exists
async function checkUserExistsInDb(phoneNumber) {
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (user) {
        return true;
    }
    return false;
}








//get user projects
async function getProjectsForUser(userId, organization, admin) {
    try {
        if (admin) {
            const projects = await Project.find({ organization_id: organization });
            return projects;
        }
        const user = await User.findById(userId).populate('projects');

        if (!user) {
            // Handle the case where the user is not found
            throw new Error(`User with ID ${userId} not found`);
        }

        // Extract the list of projects from the user object
        const projects = user.projects;
        return projects;
    } catch (err) {
        // Handle any errors that occur while fetching the user and their projects
        console.error(err);
    }
};

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
        



module.exports = {
    generateToken, addUserToDb, findAndVerifyUser, getUserOrganization, checkUserExistsInDb, getUserById
    , getUserByPhoneNumber, editUserProfile, getAllUsersInOrganizationWithRoles, getProjectsForUser, checkUserIsAdmin
    , checkIfUserWasInvited, checkIfUserIsRegistered, getUserByEmail, checkUserIsInOrganization, getAllUsers
    , checkUserIsInProject, getAllUsersInProject, getUserProjects
}