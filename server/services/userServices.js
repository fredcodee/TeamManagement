const bcrypt = require('bcrypt')
const Organization = require('../models/Organization');
const User = require('../models/User');
const Project = require('../models/Project');
const config = require('../configs/config');
const jwt = require('jsonwebtoken')


//generate token
async function generateToken (user){
    console.log(config.jwtSecret)
    const token = await jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '5d' });
    return token;
}

//add user to db
async function addUserToDb (firstName, lastName, email, password){
    try {
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: bcrypt.hashSync(password, 10)
        });
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Cant add user to db ${error}`);
    }
}



// check if user exists and verify in db
async function findAndVerifyUser (email, password){
    const user = await User.findOne({ email: email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return false;
    }

    return user;
}

//get user's organization
async function getUserOrganization (email){
    try {
        const user = await User.findOne({ email: email });
        const UserOrganizationDetails = await Organization.findById(user.organization_id);
        return UserOrganizationDetails;
    } catch (error) {
        return false
    }
}

//edit user profile
async function editUserProfile (firstName, lastName, email, password){
    try {
        await User.updateOne({email:email},{
            $set:{
                firstName:firstName,
                lastName:lastName,
                password: bcrypt.hashSync(password, 10)
            }
        })
        return true;
    } catch (error) {
        return false
    }
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



// check if user exists
async function checkUserExistsInDb (phoneNumber){
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (user) {
        return true;
    }
    return false;
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



module.exports = { generateToken, addUserToDb,findAndVerifyUser, getUserOrganization , checkUserExistsInDb, getUserById
, getUserByPhoneNumber, editUserProfile, getAllUsersInOrganization, getProjectsForUser}