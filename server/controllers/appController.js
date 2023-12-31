const errorHandler  = require('../configs/errorHandler')
const userService = require('../services/userServices')
const appService = require('../services/appServices')
const mongoose =  require('mongoose')

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
        const newUser = await userService.editUserProfile(firstName, lastName, email, password);
        const teamMembers = await userService.getAllUsersInTeam(teamId);
        await Promise.all(teamMembers?.map(async (member) => {
            const memberId = new mongoose.Types.ObjectId(member._id);
            if(!memberId.equals(req.user._id)){
                await appService.addNotificationToDbSingle( req, newUser._id, newUser.organization_id, `${firstName} ${lastName} just joined the team`,);}
        }));
        return res.json({ message: 'user is registered successfully' });
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//invite link
const inviteLink = async (req, res) => {
    try {
        const { inviteId } = req.params;
        const user = await userService.getUserById(inviteId);
        if (user) {
            //check if password is set
            if (user.password == null) {
                res.json(user)
            } else {
                return res.json({ message: 'Invalid' })
            }
        } else {
            return res.status(401).json({message: 'Invalid' })
        }
    }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//demo team and account
const demoEnvironment = async (req, res) => {
    try {
        const demoTeam = await appService.createOrganization('DemoTeam')
        //create demo accounts
        const demoAccounts= await appService.addDemoAccounts() 
        //add demo users to the team
        for(const account of demoAccounts){
            await appService.addOrganizationToUser(account._id, demoTeam._id);
        }
        // create roles in demo team 
        const roles = ["admin", "project manager", "developer", "member"]
        const createdRoles = []
        for (const roleName of roles){
            const newRole = await appService.createRole(demoTeam._id, roleName);
            createdRoles.push(newRole)
        }
        //add users to the roles
        for(const account of demoAccounts){
            if(account.email === 'admin@demo.com'){
                const role =  createdRoles.find(role => role.name === "admin");
                await appService.addUserToRole(account._id, role._id, demoTeam._id);
            }
            else if(account.email === 'projectmanager@demo.com'){
                const role =  createdRoles.find(role => role.name === "project manager");
                await appService.addUserToRole(account._id, role._id, demoTeam._id);
            }
            else if(account.email === 'developer@demo.com'){
                const role =  createdRoles.find(role => role.name === "developer");
                await appService.addUserToRole(account._id, role._id, demoTeam._id);
            }
            else if(account.email === 'member@demo.com'){
                const role =  createdRoles.find(role => role.name === "member");
                await appService.addUserToRole(account._id, role._id, demoTeam._id);
            }  
        }

        res.json({message:"success"})
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


const getDemoAccountCred = async(req, res)=>{
    try {
        const account = req.body.accountName
        const credentials = await appService.getDemoAccountCred(account)
        res.json(credentials)
    } catch (error) {
        errorHandler.errorHandler(error, res) 
    }
}


module.exports = {
    health,login,signup,inviteLink, signupWithInviteLink, demoEnvironment, getDemoAccountCred}

