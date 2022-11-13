const { Router } = require('express');

const { putOnlineDriver, put5SecondOnlineDriver } = require('../Controller/OnlineDriverController');
//Router: get user by id
const { validateToken } = require('../Middlewares/ValidateToken');


const router = Router();

//cập nhật journey và bảng onlinedriver
router.put('/onlineDriver/put-onlineDriver', validateToken, putOnlineDriver);
router.put('/onlineDriver/put-5-second-onlineDriver', validateToken, put5SecondOnlineDriver);

module.exports = router;