const bcrypt = require('bcrypt')
const Organization = require('../models/Organization');
const User = require('../models/User');
const Project = require('../models/Project');


// check if user exists and verify in db
async function findAndVerifyUser (phoneNumber, password){
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) {
        throw new Error('user not found');
    }

    //password check
    if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('invalid credentials');
    }

    return user;
}

//get user details
async function getUserById (id){
    try {
        const user = User.findById(id);
        return user;
    } catch (error) {
        throw new Error(`Cant get user details ${error}`);
    }
}

//get user by phone number
async function getUserByPhoneNumber (phoneNumber){
    try {
        const user = User.findOne({ phoneNumber: phoneNumber});
        return user;
    } catch (error) {
        throw new Error(`Cant get user details ${error}`);
    }
}

//get user's organization
async function getUserOrganization (phoneNumber){
    try {
        const user = await User.findOne({ phoneNumber: phoneNumber });
        const UserOrganizationDetails = await Organization.findOne({_id:user.organization_id});
        return UserOrganizationDetails;
    } catch (error) {
        throw new Error(`Cant get user's organization ${error}`);
    }
}

// check if user exists
async function checkUserExistsInDb (phoneNumber){
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (user) {
        return true;
    }
    return false;
}

//edit user profile
async function editUserProfile (firstName, lastName, phoneNumber, password){
    try {
        const profile = await User.find({phoneNumber:phoneNumber});
        await User.updateOne({phoneNumber:phoneNumber},{
            $set:{
                firstName:firstName,
                lastName:lastName,
                password: bcrypt.hashSync(password, 10)
            }
        })
        return true;
    } catch (error) {
        throw new Error(`Cant edit user profile ${error}`);
    }
}

//get all users in an organization
async function getAllUsersInOrganization(organizationId){
    try {
        const allUser =  await User.find({organization_id:organizationId});
        return allUser;
    } catch (error) {
        throw new Error(`Cant get all users in an organization ${error}`);
    }
}


//get user projects
async function getProjectsForUser(userId,organization, admin) {
    try {
        if (admin) {
            const projects = await Project.find({organization_id:organization});
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



module.exports = { findAndVerifyUser, getUserOrganization , checkUserExistsInDb, getUserById
, getUserByPhoneNumber, editUserProfile, getAllUsersInOrganization, getProjectsForUser}