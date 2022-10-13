const { Router } = require('express');

const { getStatusJourneyById,
    postJourney,
    putJourney,
    getAllJourneybyId,
    getAllJourneybyPhone
} = require('../Controller/JourneyController');

const { validateToken } = require('../Middlewares/ValidateToken');

const { uploadsProduct } = require('../Helpers/Multer');

const router = Router();

router.get('/journey/get-statusjourney-by-id', validateToken, getStatusJourneyById);
router.post('/journey/post-journey', validateToken, postJourney);
router.put('/journey/put-journey', validateToken, putJourney);
router.get('/journey/get-all-journey-by-id', validateToken, getAllJourneybyId);
router.get('/journey/get-all-journey-by-phone', validateToken, getAllJourneybyPhone);

//router.post('/product/add-new-product', [validateToken, uploadsProduct.single('productImage')], addNewProduct);


module.exports = router;