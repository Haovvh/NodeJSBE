const { Router } = require('express');
const { Login, RenweToken } = require('../Controller/LoginController');
const { validateToken } = require('../Middlewares/ValidateToken');

const router = Router();

    router.post('/auth/login', Login);
    router.get('/auth/renew-login', validateToken ,RenweToken );


module.exports = router;