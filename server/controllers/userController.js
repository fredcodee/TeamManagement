const bcrypt = require('bcrypt')
const errorHandler  = require('../configs/errorHandler')
const userService = require('../services/userServices')
const keycloak =require('../services/keycloak/functions')



//login and send user token and refresh token to client
const login = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const password = req.body.password;
        
        const user = await userService.findAndVerifyUser(phoneNumber, password);                 
        if (user) {
            const organization = await userService.getUserOrganization(phoneNumber);//get user's organization
            const passwordMatch = bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const tokens = await keycloak.getUserToken(phoneNumber, password,organization.name);
                res.json({
                    access_token : tokens.access_token,
                    refresh_token : tokens.refresh_token,
                    admin: user.organization_admin
                })
            }else{
                res.status(401).json({message: 'Invalid Credentials'});
            }
        }else{
            res.status(401).json({message: 'Invalid Credentials'});
        }
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
};


//signup and send user token and refresh token to client
const signup = async (req, res) => {
    try {
        const code = req.body.code;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phoneNumber = req.body.phoneNumber;
        const password = req.body.password;
        const organization =  await userService.getUserOrganization(phoneNumber)

        //check if user is invited and not registered (meaning is password is not set)
        const checkUser = await userService.getUserByPhoneNumber(phoneNumber);
        if (checkUser && checkUser.password == '') {


            //add password to user in keycloak and db
            //keycloak token
            const token = await keycloak.connectToAdminCLI();
            const keycloakUser = await keycloak.addOrUpdatePassword(organization.name,phoneNumber, password, token.data.access_token);
            const user = await userService.editUserProfile(firstName, lastName, phoneNumber, password);
            if (user && code == "33990") {
                res.json({ message: 'user is fully registered successfully' });
            } else {
                res.status(401).json({ message: 'registration failed' });
            }
        }else{
            res.status(401).json({ message: 'user already registered' });
        }
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//get user projects
const getUserProjects = async (req, res) => {
    try {
        const user = req.user;
        const organization =  await userService.getUserOrganization(user.phoneNumber)
        const projects = await userService.getProjectsForUser(user._id,organization, req.admin);
        if (projects) {
            res.json({projects})
        }else{
            res.status(401).json({ message: 'user has no projects' });
        }
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//view project


module.exports = { login , signup, getUserProjects
}

