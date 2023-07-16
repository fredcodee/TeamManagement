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


        



//get user projects
// const getUserProjects = async (req, res) => {
//     try {
//         const user = req.user;
//         const organization =  await userService.getUserOrganization(user.phoneNumber)
//         const projects = await userService.getProjectsForUser(user._id,organization, req.admin);
//         if (projects) {
//             res.json({projects})
//         }else{
//             res.status(401).json({ message: 'user has no projects' });
//         }
//     } catch (error) {
//         errorHandler.errorHandler(error, res)
//     }
// }


//view project


module.exports = { createTeam}

