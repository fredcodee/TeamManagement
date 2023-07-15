const router = require('express').Router();
const appController = require('../controllers/appController');


router.get('/health-check', appController.health)
router.get('/invite/:inviteId', appController.inviteLink)


module.exports = router;