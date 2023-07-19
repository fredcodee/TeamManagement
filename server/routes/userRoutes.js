const router = require('express').Router();
const userController = require('../controllers/userController'); 
const {userAuth} = require('../middlewares/auth');

router.post('/new/team', userAuth, userController.createTeam)
router.get('/projects', userAuth, userController.getUserProjects)
router.post('/project/info', userAuth, userController.viewProjectInfo)
router.get('/team/info', userAuth, userController.getTeamInfo)

// router.get('/projects',userAuth,userController.getUserProjects) //get user projects
module.exports = router;
