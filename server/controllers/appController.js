const errorHandler  = require('../configs/errorHandler')
const userService = require('../services/userServices')

const health = async(req, res) => {
    return res.json({ 'status': 'ok' })
}


//login and send user token
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

//signup 
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

//signup with invite link
const signupWithInviteLink = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;

        // edit user profile
        await userService.editUserProfile(firstName, lastName, email, password);
        return res.json({ message: 'user is registered successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}





//invite link
const inviteLink= async (req, res) => {
    try {
    //get invite id from params
    const {inviteId} = req.params;
    //check if invite id exists (userId)
    const user = await userService.getUserById(inviteId);
    if (user) {
        //check if password is set
        if (user.password == null) {
            //if password is not set, redirect to signup page
            res.json(user)
        }else{
            //if password is set, redirect to login page
            return res.json({message: 'user is already registered'})
        }
    }else{
        //if invite id does not exist
        res.json({message: 'invalid invite link'})
    } }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}    

module.exports = {
    health,login,signup,inviteLink, signupWithInviteLink}

