const { Router } = require('express');
const { getCustomer,
    postCustomer,
    putCustomer,
    getAllJourney,
    putJourney
} = require('../Controller/CustomerController');
const { validateToken } = require('../Middlewares/ValidateToken');
const { uploadsProduct } = require('../Helpers/Multer');

const router = Router();

router.get('/customer/get-customer', validateToken, getCustomer);
router.post('/customer/post-customer', validateToken, postCustomer);
router.put('/customer/put-customer', validateToken, putCustomer);
router.get('/customer/get-all-journey', validateToken, getAllJourney);
router.put('/customer/update-journey', validateToken, putJourney);


//router.post('/product/add-new-product', [validateToken, uploadsProduct.single('productImage')], addNewProduct);

module.exports = router;