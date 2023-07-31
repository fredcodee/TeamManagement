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

const getProfile = async (req, res) => {
    try{
        const user = req.user;
        res.json(user)
    }
    catch(error){
        errorHandler.errorHandler(error, res)
    }
}

//get team/organization info
const getTeamInfo = async (req, res) => {
    try{
        const user = req.user;
        const userTeam = await userService.getUserTeamInfo(user._id);
        res.json(userTeam)
    }
    catch(error){
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


//view user ticket in a project
const viewUserTicket = async (req, res) => {
    try {
        const user = req.user;
        const projectId = req.body.projectId;

        const userTicket = await userService.getUserTicketsInProject(user._id, projectId);
        res.json(userTicket)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//get all tickets assigned to a user in a project
const getAllUserTicketsInProject = async (req, res) => {
    try {
        const user = req.user;
        const projectId = req.body.projectId;

        const userTicket = await userService.getTicketsAssignedToUserInProject(user._id, projectId);
        res.json(userTicket)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//get ticket info
const getTicketInfo = async (req, res) => {
    try {
        const ticketId = req.body.ticketId;
        const ticket = await appService.getTicketDetails(ticketId);
        res.json(ticket)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


//get tickets in a project
const getProjectTickets = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const tickets = await appService.getAllTicketsInProject(projectId);
        res.json(tickets)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//admins and users with "Chat" permission can comment on a ticket
const commentOnTicket = async (req, res) => {
    try {
        const user = req.user;
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const ticketId = req.body.ticketId;
        const comment = req.body.comment;

        //check if user has permission to comment on ticket
        const permission = await userService.checkUserPermission(user._id,teamId, projectId, "Chat");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        if (!permission && !adminCheck) {
            return res.status(401).json({ message: 'You dont have permission to comment on this ticket' });
        }
        //add comment to ticket
        const chat= await appService.addCommentToTicket(ticketId, user._id, comment);
        res.json(chat)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}

//get all comments on a ticket
const getTicketComments = async (req, res) => {
    try {
        const ticketId = req.body.ticketId;
        const comments = await appService.getAllCommentsOnTicket(ticketId);
        res.json(comments)
    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}


// user, admin and user with "Delete" permission can delete a comment
const deleteComment = async (req, res) => {
    try {
        const user = req.user;
        const teamId = req.body.teamId;
        const projectId = req.body.projectId;
        const commentId = req.body.commentId;

        //check if user has permission to delete comment
        const permission = await userService.checkUserPermission(user._id,teamId, projectId, "Delete");
        const adminCheck = await userService.checkUserIsAdmin(req.user, teamId, res);
        const originUser = await appService.getCommentUserId(commentId);
        if (!permission && !adminCheck && originUser != user._id) {
            return res.status(401).json({ message: 'You dont have permission to delete this comment' });
        }
        //delete comment
        await appService.deleteCommentFromTicket(commentId);
        res.json({ message: 'Comment deleted successfully' })

    } catch (error) {
        errorHandler.errorHandler(error, res)
    }
}




















module.exports = { createTeam, getUserProjects, viewProjectInfo, getTeamInfo, viewUserTicket, getAllUserTicketsInProject
    , getTicketInfo, getProjectTickets, commentOnTicket, getTicketComments, deleteComment , getProfile
}

