const { Router } = require('express');
const { addOnlineDriver, getOnlineDriver, putOnlineDriver } = require('../Controller/OnlineDriverController');
const { validateToken } = require('../Middlewares/ValidateToken');
//Router: post onlineDriver, get onlineDriver, put onlineDriver

const router = Router();

router.post('/onlinedriver/post-online-driver', validateToken, addOnlineDriver);
router.get('/onlinedriver/get-driver', validateToken, getOnlineDriver);
router.put('/onlinedriver/put-driver', validateToken, putOnlineDriver);

module.exports = router;