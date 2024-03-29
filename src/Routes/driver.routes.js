const { Router } = require('express');

const { getDriver, postDriver, putDriver } = require('../Controller/DriverController');
//Router: get user by id
const { validateToken } = require('../Middlewares/ValidateToken');


const router = Router();
//lấy thông tin driver -
router.get('/driver/get-driver',validateToken, getDriver);
//cập nhật trạng thái driver trong bảng online-driver
router.post('/driver/post-driver', validateToken, postDriver);

//cập nhật journey và bảng onlinedriver
router.put('/driver/put-driver', validateToken, putDriver);

module.exports = router;