const { Router } = require('express');
const { getDriver,
    postDriver,
    putDriver,
    getAllJourney
} = require('../Controller/DriverController');

const { validateToken } = require('../Middlewares/ValidateToken');

const { uploadsProduct } = require('../Helpers/Multer');

const router = Router();

router.get('/driver/get-driver', validateToken, getDriver);
router.post('/driver/post-driver', validateToken, postDriver);
router.put('/driver/put-driver', validateToken, putDriver);
router.get('/driver/get-all-journey', validateToken, getAllJourney);

//router.post('/product/add-new-product', [validateToken, uploadsProduct.single('productImage')], addNewProduct);

module.exports = router;