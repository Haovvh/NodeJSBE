const { Router } = require('express');
const { postJourney, postJourneybyuser, getAllJourneyByPassengerID, 
    getAllJourneyByDriverID,
    getAllJourneyBySupportStaff,
    getJourneyByDriver, getJourneyByPassenger, getAllJourneyByPassenger, putJourney } = require('../Controller/JourneyController');
const { validateToken }  = require('../Middlewares/ValidateToken');

const router = Router();
   
    //tìm kiếm tài xế và tạo journey
    router.get('/journey/get-journey-by-driver', validateToken, getJourneyByDriver);

    router.get('/journey/get-journey-by-passenger', validateToken, getJourneyByPassenger);
    //getAllJourneyByPassengerID
    router.get('/journey/get-all-journey-by-passengerID', validateToken, getAllJourneyByPassengerID);

    router.get('/journey/get-all-journey-by-driverID', validateToken, getAllJourneyByDriverID);

    router.get('/journey/get-all-journey-by-supportstaffID', validateToken, getAllJourneyBySupportStaff);

    router.get('/journey/get-all-journey-by-passenger', validateToken, getAllJourneyByPassenger);

    router.post('/journey/post-journey-by-user', validateToken, postJourneybyuser);

    router.post('/journey/post-journey', validateToken, postJourney);
    
    router.put('/journey/put-journey', validateToken, putJourney);

module.exports = router;