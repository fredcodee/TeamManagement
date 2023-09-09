const userService = require('./userServices');
const Organization = require('../models/Organization');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRoles = require('../models/UserRoles');
const Project = require('../models/Project');
const persmissions = require('../models/Permissions');
const RolePermissions = require('../models/Role_Permissions');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');




//create organization/team
async function createOrganization(name) {
    try {
        //check if organization exists and return "organization already exists" if it does
        const organization = await Organization.findOne({ name: name })
        if (organization) {
            throw new Error(`Sorry a team with this name already exists`);
        }
        const newOrganization = new Organization({
            name: name,
        });
        await newOrganization.save();
        return newOrganization;
    } catch (error) {
        throw new Error(`Cant create team ${error}`);
    }
}

async function getOrganizationDetails(organizationId) {
    try {
        const organization = await Organization.findById(organizationId);
        return organization;
    }
    catch (error) {
        throw new Error(`Cant get team details ${error}`);
    }
}

async function addOrganizationToUser(userId, organizationId) {
    try {
        const user = await User.findById(userId);
        const team = await Organization.findById(organizationId);
        if (user) {
            // Check if the organization_id field is null and initialize it as an empty array if needed
            if (!user.organization_id) {
                user.organization_id = [];
            }
            // Add the organization ID to the user's organization_id array
            user.organization_id.push(team._id);
            await user.save();
            return true;
        }
    }
    catch (error) {
        throw new Error(`Cant add organization to user db ${error}`);
    }
}


async function createRole(organizationId, roleName) {
    try {
        const checkRole = await Role.findOne({ name: roleName, organization_id: organizationId });
        if (checkRole) {
            throw new Error(`Sorry a role with this name already exists`);
        }
        const role = new Role({
            name: roleName,
            organization_id: organizationId
        });
        await role.save();
        return role;
    } catch (error) {
        throw new Error(`Cant create role ${error}`);
    }
}


async function addUserToRole(userId, roleId, organizationId) {
    try {
        const userRole = new UserRoles({
            user_id: userId,
            role_id: roleId,
            organization_id: organizationId
        });

        await userRole.save();
        return userRole;
    } catch (error) {
        throw new Error(`Cant add user to role ${error}`);
    }
}


async function removeUserFromRole(userId, roleId, organizationId) {
    try {
        await UserRoles.deleteMany({ user_id: userId, organization_id: organizationId });
        return true;
    } catch (error) {
        throw new Error(`Cant remove user from role ${error}`);
    }
}



async function inviteUserToOrganization(email, organizationId) {
    try {
        //add user to db
        const user = await userService.addUserToDb(null, null, email, null);
        //add organization to user
        await addOrganizationToUser(user._id, organizationId);

        return user._id;
    } catch (error) {
        throw new Error(`Cant invite user to organization ${error}`);
    }
}


async function checkUserHasRoleInOrganization(userId, organizationId) {
    try {
        const userRole = await UserRoles.findOne({ user_id: userId, organization_id: organizationId });
        return !!userRole;
    } catch (error) {
        throw new Error(`Cant check if user has role in organization ${error}`);
    }
}


async function editOrganizationDetails(teamId, name) {
    try {
        const team = await Organization.findById(teamId);
        team.name = name;
        await team.save();
        return team;
    } catch (error) {
        throw new Error(`Cant edit organization details ${error}`);
    }
}

async function removeUserFromOrganization(userId, organizationId) {
    try {
        await User.findOneAndUpdate({ _id: userId }, { $pull: { organization_id: organizationId } });

        await UserRoles.deleteMany({ user_id: userId, organization_id: organizationId });

        for (const project of await getAllProjects(organizationId)) {
            await removeUserFromProject(userId, project._id);
        }
        return true;
    } catch (error) {
        throw new Error(`Cant remove user from organization ${error}`);
    }
}


async function createProject(organizationId, name, info) {
    try {
        const project = new Project({
            name: name,
            organization_id: organizationId,
            info: info
        });
        await project.save();
        return project;
    } catch (error) {
        throw new Error(`Cant create project ${error}`);
    }
}


async function addUserToProject(userId, projectId) {
    try {
        const user = await User.findById(userId);
        const project = await Project.findById(projectId);
        if (user) {
            user.projects.push(project._id);
            await user.save();
            return true;
        }
    }
    catch (error) {
        throw new Error(`Cant add user to project ${error}`);
    }
}


async function removeUserFromProject(userId, projectId) {
    try {
        await User.findOneAndUpdate({ _id: userId }, { $pull: { projects: projectId } });
        return true;
    } catch (error) {
        throw new Error(`Cant remove user from project ${error}`);
    }
}



async function getAllProjects(organizationId) {
    try {
        const projects = await Project.find({ organization_id: organizationId });
        //sort by latest date
        projects.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        return projects;
    } catch (error) {
        throw new Error(`Cant get projects ${error}`);
    }
}


async function getAllRoles(organizationId) {
    try {
        const roles = await Role.find({ organization_id: organizationId });
        return roles;
    } catch (error) {
        throw new Error(`Cant get roles ${error}`);
    }
}



async function getProjectInfo(projectId) {
    try {
        const project = await Project.findById(projectId);
        return project;
    }
    catch (error) {
        throw new Error(`Cant get project details ${error}`);
    }

}


async function editProjectDetails(projectId, name, info) {
    try {
        const project = await Project.findById(projectId);
        project.name = name;
        project.info = info;
        await project.save();
        return project;
    }
    catch (error) {
        throw new Error(`Cant edit project details ${error}`);
    }
}


async function deleteRole(roleId, organizationId) {
    try {
        //unasign all users from the role
        await UserRoles.deleteMany({ role_id: roleId, organization_id: organizationId });
        //delete the role
        await Role.findByIdAndDelete(roleId);
        return true;


    } catch (error) {
        throw new Error(`Cant delete roles ${error}`);
    }
}



async function addPermissions() {
    try {
        const listOfPermissions = ["Edit", "Delete", "Invite", "Chat", "Remove"]
        for (const permission of listOfPermissions) {
            if (await persmissions.findOne({ name: permission })) {
                continue;
            }
            const newPermission = new persmissions({
                name: permission
            });
            await newPermission.save();
        }
        return true;
    }
    catch (error) {
        throw new Error(`Cant add permissions ${error}`);
    }
}

async function getAllPermissions() {
    try {
        const permissions = await persmissions.find();
        return permissions;
    }
    catch (error) {
        throw new Error(`Cant get permissions ${error}`);
    }
}


async function addPermissionToRole(roleId, permissionId, projectId, organizationId) {
    try {
        const rolePermission = await RolePermissions.findOne({ role_id: roleId, permission_id: permissionId, project_id: projectId, organization_id: organizationId });
        if (rolePermission) {
            return true;
        }
        const newRolePermission = new RolePermissions({
            role_id: roleId,
            permission_id: permissionId,
            project_id: projectId,
            organization_id: organizationId
        });
        await newRolePermission.save();
        return true;
    }
    catch (error) {
        throw new Error(`Cant add permissions to role ${error}`);
    }
}

async function removePermissionFromRole(roleId, permissionId, projectId, organizationId) {
    try {
        await RolePermissions.findOneAndDelete({ role_id: roleId, permission_id: permissionId, project_id: projectId, organization_id: organizationId });
        return true;
    }
    catch (error) {
        throw new Error(`Cant remove permissions from role ${error}`);
    }
}


async function getAllRolesWithPermissions(organizationId, projectId) {
    try {
        const roles = await Role.find({ organization_id: organizationId });
        const rolesWithPermissions = [];

        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            const rolePermissions = await RolePermissions.find({ role_id: role._id, organization_id: organizationId, project_id: projectId });
            const permissions = [];
            for (let j = 0; j < rolePermissions.length; j++) {
                const rolePermission = rolePermissions[j];
                const permission = await persmissions.findById(rolePermission.permission_id);
                permissions.push(permission);
            }
            const roleWithPermissions = {
                role: role,
                permissions: permissions
            };
            rolesWithPermissions.push(roleWithPermissions);
        }
        return rolesWithPermissions;
    }
    catch (error) {
        throw new Error(`Cant get roles with permissions ${error}`);
    }
}

async function getAllInvitedUsers(organizationId) {
    try {
        const users = await User.find({ organization_id: organizationId, password: null });
        return users;
    }
    catch (error) {
        throw new Error(`Cant get invited users ${error}`);
    }
}


async function addTicketToProject(teamId, projectId, ticketName, ticketDescription, ticketType, ticketPriority, ticketStatus, ticketAssignTo, ticketReporter, ticketDueDate, pinned) {
    try {
        const ticket = new Ticket({
            organization_id: teamId,
            title: ticketName,
            description: ticketDescription,
            status: ticketStatus,
            priority: ticketPriority,
            deadLine: ticketDueDate,
            type: ticketType,
            project_id: projectId,
            created_by: ticketReporter,
            assigned_to: ticketAssignTo,
            pinned: pinned
        });
        await ticket.save();
        return ticket;
    } catch (error) {
        throw new Error(`Cant add ticket to project ${error}`);
    }
}

async function editTicketDetails(ticketId, ticketName, ticketDescription, ticketType, ticketPriority, ticketStatus, ticketAssignTo, ticketDueDate, pinned) {
    try {
        const ticket = await Ticket.findById(ticketId);
        ticket.title = ticketName;
        ticket.description = ticketDescription;
        ticket.status = ticketStatus;
        ticket.priority = ticketPriority;
        ticket.deadLine = ticketDueDate;
        ticket.type = ticketType;
        ticket.assigned_to = ticketAssignTo;
        ticket.pinned = pinned;
        ticket.updated_at = Date.now();
        await ticket.save();
        return ticket;
    } catch (error) {
        throw new Error(`Cant edit ticket details ${error}`);
    }
}


async function getTicketDetails(ticketId) {
    try {
        const ticket = await Ticket.findById(ticketId).populate('created_by assigned_to project_id');
        return ticket;
    } catch (error) {
        throw new Error(`Cant get ticket details ${error}`);
    }
}

async function getAllTicketsInProject(projectId) {
    try {
        const tickets = await Ticket.find({ project_id: projectId }).populate('created_by assigned_to')
        tickets.sort((a, b) => {
            if (a.pinned && !b.pinned) {
                return -1;
            } else if (!a.pinned && b.pinned) {
                return 1;
            } else {
                return new Date(b.created_at) - new Date(a.created_at);
            }
        });
        return tickets;
    } catch (error) {
        throw new Error(`Cant get all tickets in project ${error}`);
    }
}


async function deleteTicketFromProject(ticketId) {
    try {
        await Ticket.findByIdAndDelete(ticketId);
        await Comment.deleteMany({ ticket_id: ticketId });
        return true;
    } catch (error) {
        throw new Error(`Cant delete ticket from project ${error}`);
    }
}

async function addCommentToTicket(ticketId, userId, comment) {
    try {
        const newComment = new Comment({
            ticket_id: ticketId,
            user_id: userId,
            comment: comment
        });
        await newComment.save();
        return newComment;
    } catch (error) {
        throw new Error(`Cant add comment to ticket ${error}`);
    }
}


async function getAllCommentsOnTicket(ticketId) {
    try {
        const comments = await Comment.find({ ticket_id: ticketId }).populate('user_id')
        return comments;
    } catch (error) {

        throw new Error(`Cant get all comments on ticket ${error}`);
    }
}


//get comment user_id
const getCommentUserId = async (commentId) => {
    try {
        const userId = await Comment.findById(commentId);
        return userId.user_id;
    } catch (error) {
        throw new Error(`Cant get comment user_id ${error}`);
    }
}


async function deleteCommentFromTicket(commentId) {
    try {
        await Comment.findByIdAndDelete(commentId);
        return true;
    } catch (error) {
        throw new Error(`Cant delete comment from ticket ${error}`);
    }
}


async function deleteProject(projectId) {
    try {
        // delete all comments on tickets in project
        for (const ticket of await getAllTicketsInProject(projectId)) {
            await Comment.deleteMany({ ticket_id: ticket._id });
        }
        //delete all tickets in project
        await Ticket.deleteMany({ project_id: projectId });
        await Project.findByIdAndDelete(projectId);
        return true;
    } catch (error) {
        throw new Error(`Cant delete project ${error}`);
    }
}


async function deleteOrganization(organizationId) {
    try {
        //delete all projects in organization
        for (const project of await getAllProjects(organizationId)) {
            await deleteProject(project._id);
        }
        await Role.deleteMany({ organization_id: organizationId });
        await RolePermissions.deleteMany({ organization_id: organizationId });
        await UserRoles.deleteMany({ organization_id: organizationId });
        await Role.deleteMany({ organization_id: organizationId });
        await User.deleteMany({ organization_id: organizationId });
        await Organization.findByIdAndDelete(organizationId)
        return true;
    } catch (error) {
        throw new Error(`Cant delete organization ${error}`);
    }
}



async function pinAndUnpinTicket(ticketId, pin) {
    try {
        const ticket = await Ticket.findById(ticketId);
        ticket.pinned = pin;
        await ticket.save();
        return ticket;
    } catch (error) {
        throw new Error(`Cant pin/unpin ticket ${error}`);
    }
}



// notification func
async function addNotificationToDbSingle(req, userId, teamId, notificationMessage, notificationLink) {
    try {
        const notification = new Notification({
            user_id: userId,
            teamId: teamId,
            notification: notificationMessage,
            link: notificationLink || null
        }
        );
        await notification.save();

        const io = req.app.get('io'); // get io object from app
        const alertData = {
            userId: notification.user_id,
            notification: notification.notification,
            link: notification.link
        }
        await io.emit('Notification', alertData);
        return true;
    } catch (error) {
        throw new Error(`Cant add notification to db ${error}`);
    }
}

async function readNotification(NotificationId) {
    try {
        const notification = await Notification.findById(NotificationId);
        notification.read = true;
        await notification.save();
        return true;
    } catch (error) {
        throw new Error(`Cant read notification ${error}`);
    }
}

async function getAllNotifications(userId) {
    try {
        //delete any notification older than 30 days
        const date = new Date();
        date.setDate(date.getDate() - 30);
        await Notification.deleteMany({ created_at: { $lt: date } });

        //get all notifications
        const notifications = await Notification.aggregate([
            {
                $match: { user_id: userId }
            },
            {
                $sort: {
                    read: 1,
                    created_at: -1
                }
            }
        ]);
        await deleteNotification_30days()
        return notifications;
    } catch (error) {
        throw new Error(`Can't get all notifications: ${error}`);
    }
}

async function deleteNotification(notificationId) {
    try {
        await Notification.findByIdAndDelete(notificationId);
        return true;
    } catch (error) {
        throw new Error(`Cant delete notification ${error}`);
    }
}

async function deleteNotification_30days() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Check if the notification's timestamp is older than 30 
        await Notification.deleteMany({
            created_at: { $lt: thirtyDaysAgo }
        });
        return true

    }
    catch (error) {
        throw new Error(`Cant delete notification older then 30 days ${error}`);
    }

}

async function addDemoAccounts(){
    try{
        const accounts = [
            {'email':'admin@demo.com', 'firstName':"Mike", "lastName":"Dean" , "Password":"admin"},
            {'email':'projectmanager@demo.com', 'firstName':"Sam", "lastName":"Stones" , "Password":"projectmanager"},
            {'email':'developer@demo.com', 'firstName':"Sarah", "lastName":"Kate" , "Password":"developer"},
            {'email':'member@demo.com', 'firstName':"Russels", "lastName":"Damie" , "Password":"member"}
        ]

        const createdAccounts = []

        for(const account of accounts){
            const registered = await userService.checkIfUserIsRegistered(account.email);
            if (registered) {
                return new Error('This email is already registered');
            }
            const newUser = await userService.addUserToDb(account.firstName, account.lastName, account.email, account.Password);
            createdAccounts.push(newUser)
        }
        return createdAccounts.length > 0 ? createdAccounts : false
    }
    catch(error){
        throw new Error(`Cant add demo accounts ${error}`)
    }
}


async function getDemoAccountCred(accountName) {
    try {
        const currentAccountNames = ["admin", "projectmanager", "developer", "member"];
        const accountExists = currentAccountNames.includes(accountName);

        if (!accountExists) {
            return null; 
        }

        const getAccount = await User.findOne({ email: `${accountName}@demo.com` });
        if (!getAccount) {
            return null;
        }

        const data = {
            email: getAccount.email,
            password: accountName,
        };

        return data;
    } catch (error) {
        throw new Error(`Unable to get demo account credentials: ${error}`);
    }
}






//get all team (remove later)
async function getAllOrganizations() {
    try {
        const organizations = await Organization.find();
        return organizations;
    } catch (error) {
        throw new Error(`Cant get organizations ${error}`);
    }
}






module.exports = {
    createOrganization, addOrganizationToUser, createRole, addUserToRole, inviteUserToOrganization,
    getAllOrganizations, checkUserHasRoleInOrganization, removeUserFromRole, editOrganizationDetails
    , removeUserFromOrganization, createProject, addUserToProject, removeUserFromProject, getAllProjects
    , getAllRoles, getProjectInfo, editProjectDetails, getOrganizationDetails, deleteRole, addPermissions, getAllPermissions
    , addPermissionToRole, getAllRolesWithPermissions, removePermissionFromRole, getAllInvitedUsers, addTicketToProject, editTicketDetails
    , getTicketDetails, getAllTicketsInProject, deleteTicketFromProject, addCommentToTicket, getAllCommentsOnTicket, deleteCommentFromTicket
    , getCommentUserId, deleteProject, deleteOrganization, pinAndUnpinTicket, addNotificationToDbSingle, readNotification, getAllNotifications, deleteNotification,
    addDemoAccounts, getDemoAccountCred
}