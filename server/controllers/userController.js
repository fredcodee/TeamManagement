const errorHandler  = require('../configs/errorHandler')
const userService = require('../services/userServices')
const appService = require('../services/appServices')


// create Team/organization
const createTeam = async (req, res) => {
    try {
        const teamName = req.body.teamName;
        const team = await appService.createOrganization(teamName);
        //add team to user
        const user = req.user;
        await appService.addOrganizationToUser(user._id, team._id);
        //create "admin" role for user
        const role = await appService.createRole(team._id, "admin");
        //add user as admin to team
        await appService.addUserToRole(user._id, role._id, team._id);
        res.json(team)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//get user's projects
const getUserProjects = async (req, res) => {
    try {
        const user = req.user;
        const projects = await userService.getUserProjects(user._id);
        res.json(projects)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//view project info
const viewProjectInfo = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const project = await appService.getProjectInfo(projectId);
        res.json(project)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}



module.exports = { createTeam, getUserProjects, viewProjectInfo}

