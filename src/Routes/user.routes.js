const { Router } = require('express');
const { addNewUser, getUserById,changeFotoProfile, updateInformationUser, updateStreetAddress, createjourney, getAllJourneybyId } = require('../Controller/UserController');
const { uploadsProfile } = require('../Helpers/Multer');
const { validateToken }  = require('../Middlewares/ValidateToken');

const router = Router();
    //thêm mới user
    router.post('/user/add-new-user', addNewUser);
    //lấy thông tin user
    router.get('/user/get-user-by-id', validateToken, getUserById);
    //sửa thông tin user
    router.put('/user/update-picture-profile', [ validateToken, uploadsProfile.single('image') ], changeFotoProfile );
    
    router.put('/user/update-information-user', validateToken, updateInformationUser);
    router.put('/user/update-street-address', validateToken, updateStreetAddress);

    //tìm kiếm tài xế và tạo journey
    router.post('/user/create-journey', validateToken, createjourney);
    router.get('/user/create-journey', validateToken, getAllJourneybyId);

module.exports = router;