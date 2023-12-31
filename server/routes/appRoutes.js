const router = require('express').Router();
const appController = require('../controllers/appController');


router.get('/health-check', appController.health)
router.post('/login', appController.login)
router.post('/register', appController.signup)
router.get('/invite/:inviteId', appController.inviteLink)
router.post('/signup/invite', appController.signupWithInviteLink)
router.get('/create/demo/environment', appController.demoEnvironment)
router.post('/get-demo-account-credentials', appController.getDemoAccountCred)


module.exports = router;