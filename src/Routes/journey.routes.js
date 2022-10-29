const { Router } = require('express');
const { postJourney, postJourneybyuser, getJourneyByDriver, getJourneyByPassenger, getAllJourneyByPassenger, putJourney } = require('../Controller/JourneyController');
const { validateToken }  = require('../Middlewares/ValidateToken');

const router = Router();
   
    //tìm kiếm tài xế và tạo journey
    router.get('/journey/get-journey-by-driver', validateToken, getJourneyByDriver);

    router.get('/journey/get-journey-by-passenger', validateToken, getJourneyByPassenger);
    
    router.get('/journey/get-all-journey-by-passenger', validateToken, getAllJourneyByPassenger);

    router.post('/journey/post-journey-by-user', validateToken, postJourneybyuser);

    router.post('/journey/post-journey', validateToken, postJourney);
    
    router.put('/journey/put-journey', validateToken, putJourney);

module.exports = router;