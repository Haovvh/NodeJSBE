const { Router } = require('express');

const { putOnlineDriver } = require('../Controller/OnlineDriverController');
//Router: get user by id
const { validateToken } = require('../Middlewares/ValidateToken');


const router = Router();

//cập nhật journey và bảng onlinedriver
router.put('/onlineDriver/put-onlineDriver', validateToken, putOnlineDriver);

module.exports = router;