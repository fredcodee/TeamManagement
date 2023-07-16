const errorHandler  = require('../configs/errorHandler')
const userService = require('../services/userServices')



//login and send user token and refresh token to client
const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const user = await userService.findAndVerifyUser(email, password);                 
        if (user) {
            const token = await userService.generateToken(user);
            return res.json({request:"user details are valid", token:token})
        }else{
            return res.status(401).json({message: 'Invalid Credentials'});
        }
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
};


//signup and send user token and refresh token to client
const signup = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;


        //check if user is already registered
        const registered = await userService.checkIfUserIsRegistered(email);
        if (registered) {
            return res.status(401).json({ message: 'This email is already registered' });
        }
        //check if user is invited
        const invited = await userService.checkIfUserWasInvited(email);
        if (invited) {
            //add password to user db
            const user = await userService.editUserProfile(firstName, lastName, email, password);
            if (user) {
                return res.json({ message: 'user is fully registered successfully' });
            } else {
                return res.status(401).json({ message: 'registration failed' });
            }
        }
        if (!invited) {
            //add user to db
            await userService.addUserToDb(firstName, lastName, email, password);
            return res.json({ message: 'user is registered successfully' });
        }
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


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


module.exports = { login , signup,
}

