const errorHandler  = require('../configs/errorHandler')
const userService = require('../services/userServices')


// create Team


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


module.exports = {
}

