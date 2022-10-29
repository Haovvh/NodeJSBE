const { Router } = require('express');
const { getUser, postUser, changeFotoProfile, putUser } = require('../Controller/UserController');
const { uploadsProfile } = require('../Helpers/Multer');
const { validateToken }  = require('../Middlewares/ValidateToken');

const router = Router();

    //lấy thông tin user
    router.get('/user/get-user', validateToken, getUser);
    //thêm mới user
    router.post('/user/post-user', postUser);
    
    router.put('/user/put-user', validateToken, putUser);
    //sửa thông tin user
    router.put('/user/update-picture-profile', [ validateToken, uploadsProfile.single('image') ], changeFotoProfile );    
    

module.exports = router;