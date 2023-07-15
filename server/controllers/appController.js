const errorHandler  = require('../configs/errorHandler')
const userService = require('../services/userServices')

const health = async(req, res) => {
    return res.json({ 'status': 'ok' })
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
        if (user.password == '') {
            //if password is not set, redirect to verify phone number page
            res.json({message: 'verify'})
        }else{
            //if password is set, redirect to login page
            res.json({message: 'already registered'})
        }
    }else{
        //if invite id does not exist, redirect to login page
        res.json({message: 'already registered'})
    } }
    catch (error) {
        errorHandler.errorHandler(error, res)
    }
}    

module.exports = {
    health, inviteLink}

