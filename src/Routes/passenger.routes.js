const { Router } = require('express');
const { addNewUser, getUserById, changeFotoProfile, updateInformationUser } = require('../Controller/PassengerController');
const { uploadsProfile } = require('../Helpers/Multer');
const { validateToken } = require('../Middlewares/ValidateToken');
//Router: add user, get user by id, put user

const router = Router();

router.post('/user/add-new-user', addNewUser);
router.get('/user/get-user-by-id', validateToken, getUserById);
router.put('/user/update-picture-profile', [validateToken, uploadsProfile.single('image')], changeFotoProfile);
router.put('/user/update-information-user', validateToken, updateInformationUser);

module.exports = router;