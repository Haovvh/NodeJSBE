const { Router } = require('express');
const { addNewUser, getUserByPhone, updateUser } = require('../Controller/UserController');
//Router: add user, get user by id, put user

const router = Router();
router.post('/user/add-new-user', addNewUser);
router.get('/user/get-user-by-phone', getUserByPhone);
router.put('/user/update-user', updateUser);


module.exports = router;