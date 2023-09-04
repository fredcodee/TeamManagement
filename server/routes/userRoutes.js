const router = require('express').Router();
const userController = require('../controllers/userController'); 
const {userAuth} = require('../middlewares/auth');

router.post('/new/team', userAuth, userController.createTeam)
router.get('/profile', userAuth, userController.getProfile)
router.get('/projects', userAuth, userController.getUserProjects)
router.post('/project/info', userAuth, userController.viewProjectInfo)
router.get('/team/info', userAuth, userController.getTeamInfo)
router.post('/team/count/members', userAuth, userController.countTeamMembers)
router.post('/project/tickets', userAuth, userController.viewUserTicket)
router.get('/project/tickets/all', userAuth, userController.getAllUserTickets)
router.post('/project/ticket/assigned', userAuth, userController.getAllUserTicketsInProject)
router.get('/project/ticket/assigned/all', userAuth, userController.getAllUserTicketsInAllProjects)
router.post('/project/ticket/details', userAuth, userController.getTicketInfo)
router.post('/project/ticket/all', userAuth, userController.getProjectTickets)
router.post('/project/ticket/add/comment', userAuth, userController.commentOnTicket)
router.post('/project/ticket/comments', userAuth, userController.getTicketComments)
router.post('/project/ticket/comment/delete', userAuth, userController.deleteComment)
router.post('/team/all/users', userAuth, userController.getAllUsersInTeam)
router.post('/project/leave', userAuth, userController.leaveProject)
router.post('/project/user/roleinfo', userAuth, userController.getUsersRolePermissionsInProject)
router.get('/notifications/all', userAuth, userController.getAllNotifications)
router.post('/notification/read', userAuth, userController.updateNotificationStatus)
router.post('/notification/delete', userAuth, userController.deleteNotification)

module.exports = router;
