const router = require('express').Router();
const adminController = require('../controllers/adminController'); 
const {adminAuth} = require('../middlewares/auth');

router.post('/new/organization', adminController.addOrganization)
router.post('/new/admin-account', adminController.createAdminUser)
router.post('/new/user-account',adminAuth,adminController.createUserAccount)
router.post('/get-inviteId', adminAuth, adminController.getUserInviteId) //get user invite id
router.post('/delete/user-account',adminAuth,adminController.removeUserAccount)
router.get('/organization/users',adminAuth,adminController.getUsersInOrganization) //all users in organization
router.get('/all/users/invites',adminAuth,adminController.getInvitedUsersInOrganization) //all users in organization with empty password(invites)
router.post('/new/project',adminAuth,adminController.createProject)
router.post('/project/new/role',adminAuth,adminController.createProjectRole)
router.post('/project/add/user',adminAuth,adminController.addUserToProject)
router.post('/project/assign/user',adminAuth,adminController.assignProjectRoleToUser)
router.post('/project/unassign/user',adminAuth,adminController.unassignProjectRoleFromUser)//unassign user from a role
router.post('/project/roles',adminAuth,adminController.getProjectRoles) //get all roles for a project
router.post('/project/all/users-info',adminAuth,adminController.getUsersAndTheirRolesInProject) //get all users for a project and their roles


module.exports = router;