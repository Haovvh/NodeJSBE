const { Router } = require('express');

const { getJourneyById, postJourney, putJourney } = require('../Controller/JourneyController');
//Router: add journey, get journey by id, put journey

const { validateToken } = require('../Middlewares/ValidateToken');

const router = Router();

router.get('/journey/get-journey-by-id', validateToken, getJourneyById);
router.post('/journey/post-journey', validateToken, postJourney);
router.put('/journey/put-journey', validateToken, putJourney);



module.exports = router;