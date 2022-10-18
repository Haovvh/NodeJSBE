const { Router } = require('express');

const { getDriver } = require('../Controller/DriverController');
//Router: get user by id
const { validateToken } = require('../Middlewares/ValidateToken');


const router = Router();

router.get('/driver/get-driver', validateToken, getDriver);

module.exports = router;