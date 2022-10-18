const { Router } = require('express');
const { LoginUser, RenewToken } = require('../Controller/LoginController');
const { validateToken } = require('../Middlewares/ValidateToken');

const router = Router();

router.post('/auth/login', LoginUser);
router.get('/auth/renew-login', validateToken, RenewToken);

module.exports = router;