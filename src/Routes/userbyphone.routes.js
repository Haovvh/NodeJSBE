const { Router } = require('express');
const { getUserbyPhone, postUserbyPhone, putUserbyPhone } = require('../Controller/UserByPhoneController');
const { validateToken }  = require('../Middlewares/ValidateToken');

const router = Router();

    //lấy thông tin user
    router.get('/user-by-phone/get-user-by-phone/:Phone', validateToken, getUserbyPhone);
    //thêm mới user
    router.post('/user-by-phone/post-user-by-phone', postUserbyPhone);
    
    router.put('/user-by-phone/put-user-by-phone', validateToken, putUserbyPhone);
    

module.exports = router;