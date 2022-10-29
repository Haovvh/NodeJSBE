const { Router } = require('express');
const { Login, RenweToken } = require('../Controller/LoginController');
const { validateToken } = require('../Middlewares/ValidateToken');

const router = Router();

    router.post('/login/login', Login);
    router.get('/login/renew-login', validateToken ,RenweToken );

module.exports = router;