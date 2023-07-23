const router = require('express').Router();
const adminController = require('../controllers/adminController'); 
const {userAuth} = require('../middlewares/auth');


router.post('/invite/user',userAuth, adminController.inviteUser)
router.post('/user/invite/id',userAuth, adminController.getUserInviteId)
router.post('/create/role',userAuth, adminController.createRole)
router.post('/add/user/role',userAuth, adminController.addUserToRole)
router.post('/remove/user/role',userAuth, adminController.removeUserFromRole)
router.post('/edit/team', userAuth, adminController.editTeamDetails)
router.post('/remove/user/team', userAuth, adminController.removeUserFromTeam)
router.post('/new/project', userAuth, adminController.createProject)
router.post('/all/projects', userAuth, adminController.getAllProjectsInTeam)
router.post('/project/add/user', userAuth, adminController.addUserToProject)
router.post('/project/remove/user', userAuth, adminController.removeUserFromProject)
router.post('/project/all/users', userAuth, adminController.getAllUsersInProject)
router.post('/project/edit', userAuth, adminController.editProjectDetails)
router.post('/team/all/user&roles', userAuth, adminController.getUsersInTeamAndRoles)
router.post('/team/all/roles', userAuth, adminController.getAllRolesInTeam)
router.post('/delete/role', userAuth, adminController.deleteRole)
router.post('/add/permission', userAuth, adminController.addPermissions)
router.get('/permission/list/all', userAuth, adminController.getAllPermissions)
router.post('/permission/add/role', userAuth, adminController.addPermissionToRole)
router.post('/permission/remove/role', userAuth, adminController.removePermissionFromRole)
router.post('/project/roleswithpermissions', userAuth, adminController.getAllRolesWithPermissions)
router.post('/project/user/permissions', userAuth, adminController.getUsersRolePermissionsInProject)
router.post('/team/all/invites', userAuth, adminController.getAllInvitesInTeam)
router.post('/project/ticket/add', userAuth, adminController.addTicketToProject)
router.post('/project/ticket/edit', userAuth, adminController.editTicketDetails)
//remove later
router.post('/get/all/users', userAuth, adminController.getAllUsers)
router.post('/get/all/teams',userAuth, adminController.getAllTeams)

module.exports = router;