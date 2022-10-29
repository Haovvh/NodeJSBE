const { request, response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const MySql = require('../DB/MySql');
const {decodeToken} = require('../Middlewares/decodeToken')
const jwt = require('jsonwebtoken');

//postJourney, getJourneybyId, putJourneybyId

const postJourney = async (req = request, res = response) => {
    
    try {
        console.log("vao postjourney")
        const {Passenger_ID, 
            driver_ID, 
            User_ID,
            Price, 
            origin_Id, 
            origin_Fulladdress, 
            destination_Id, 
            destination_Fulladdress, 
            distance_km, 
            pointCode} = req.body;    
        const token = req.header('x-access-token');
        console.log(req.body)
        
        
        const conn = await MySql();
        //check xem tài xế đã nhận chuyến đi chưa?
        const isOnlineDriver = await conn.query(`SELECT * FROM journeys WHERE Passenger_ID = ? AND Status = ? `, [ Passenger_ID, 'Create']);
        console.log(isOnlineDriver[0])
        console.log("driver")
        
        if( isOnlineDriver[0].length === 0 ){
            console.log("khoi tao journey")
            await conn.query(`INSERT INTO journeys 
            ( Passenger_ID, Driver_ID, Price, origin_Id, origin_Fulladdress, destination_Id, destination_Fulladdress, distance_km, pointCode) 
            VALUE (?,?,?,?,?,?,?,?,?);`, 
            [Passenger_ID, driver_ID, Price, origin_Id, origin_Fulladdress, destination_Id, destination_Fulladdress, distance_km, pointCode]);
            console.log("Tao thanh cong journey")
            conn.end();

            return res.json({
                resp: true,
                message : 'Create journey is success!',

            });
        
        } else {
            console.log("else post journey")
            return res.json({
                resp: false,
                message : 'No connect driver'
            }); 
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
        }); 
    }
    

}

const postJourneybyuser = async (req = request, res = response) => {
    
    try {
        console.log("vao postjourney")
        const {driver_ID, 
            User_ID,
            Price, 
            origin_Id, 
            origin_Fulladdress, 
            destination_Id, 
            destination_Fulladdress, 
            distance_km, 
            pointCode} = req.body;    
        console.log(req.body)
        
        
        const conn = await MySql();
        //check xem tài xế đã nhận chuyến đi chưa?
        await conn.query(`INSERT INTO journeys 
            ( User_ID, Driver_ID, Price, origin_Id, origin_Fulladdress, destination_Id, destination_Fulladdress, distance_km, pointCode) 
            VALUE (?,?,?,?,?,?,?,?,?);`, 
            [User_ID, driver_ID, Price, origin_Id, origin_Fulladdress, destination_Id, destination_Fulladdress, distance_km, pointCode]);
            console.log("Tao thanh cong journey")
            conn.end();

            return res.json({
                resp: true,
                message : 'Create journey is success!',

            });        
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
        }); 
    } 
}

const getJourneyByDriver = async (req = request, res = response) => {    
    
    try {   
        console.log("get journey success")
        const driver_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        //const driver_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();
        
        const getalljourney = await conn.query(`SELECT journeys.pointCode, journeys.Price, 
        journeys.origin_Fulladdress , journeys.destination_Fulladdress,
        Passengers.Passenger_ID, Passengers.FullName, Passengers.Phone FROM journeys 
        LEFT JOIN Passengers on (journeys.Passenger_ID = Passengers.Passenger_ID)
        WHERE Driver_ID = ? AND Status = 'Create' `, [driver_ID]);        
        conn.end();

        if( getalljourney[0].length !== 0 ){        
            console.log("True")

            return res.json({
                resp: true,
                message : 'Get journey is success!',
                data: getalljourney[0][0]
            });
        
        } else {
            console.log("False")
            return res.json({
                resp: false,
                message : 'No journey'
            }); 
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
    

}
const getJourneyByPassenger = async (req = request, res = response) => {    
    
    try {   
        console.log("get journey by passenger success")
        const Passenger_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        //const driver_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();
        
        const getalljourney = await conn.query(`SELECT journeys.Passenger_ID, 
        journeys.pointCode, journeys.Price, 
        journeys.origin_Fulladdress , journeys.destination_Fulladdress,
        Passengers.FullName, Passengers.Phone, drivers.Car_code, drivers.Car_color ,
        drivers.Car_type
        FROM journeys 
        LEFT JOIN drivers on (journeys.Driver_ID = drivers.Driver_ID) 
        LEFT JOIN Passengers on (Passengers.Passenger_ID = drivers.Driver_ID)
        WHERE journeys.Passenger_ID = ? AND   Status = 'Create' `, [Passenger_ID]);        
        conn.end();
        console.log(getalljourney[0])

        if( getalljourney[0].length !== 0 ){        
            console.log("True")

            return res.json({
                resp: true,
                message : 'Get journey is success!',
                data: getalljourney[0][0]
            });
        
        } else {
            console.log("False")
            return res.json({
                resp: false,
                message : 'No journey'
            }); 
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}

const getAllJourneyByPassenger = async (req = request, res = response) => {    
    
    try {   
        console.log("get All journey by passenger success")
        const Passenger_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        //const driver_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();
        
        const getalljourney = await conn.query(`
        SELECT origin_Fulladdress, COUNT(origin_Id) AS Count
        FROM journeys 
        WHERE Passenger_ID = ? AND   Status = 'Success' 
        GROUP BY origin_Id 
        union
        SELECT destination_Fulladdress, COUNT(destination_Id) AS Count
        FROM journeys 
        WHERE Passenger_ID = ? AND   Status = 'Success' 
        GROUP BY destination_Id
        `, [Passenger_ID, Passenger_ID]);        
        conn.end();
        console.log(getalljourney[0])

        if( getalljourney[0].length !== 0 ){        
            console.log("True")

            return res.json({
                resp: true,
                message : 'Get journey is success!',
                data: getalljourney[0]
            });
        
        } else {
            console.log("False")
            return res.json({
                resp: false,
                message : 'No journey'
            }); 
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
        });
    } 
}

const putJourney = async (req = request, res = response ) => {

    try {
        console.log("put journey")
        const {driver_ID, Passenger_ID, Status} = req.body;
        console.log(req.body);
        const conn = await MySql();

        await conn.query(`UPDATE journeys SET Status = ? , finish_time = ? WHERE driver_ID = ? AND Passenger_ID = ? AND Status = ?`, ['Success', new Date(), driver_ID, Passenger_ID, Status]);

        conn.end();

        return res.json({
            resp: true,
            message: 'Update journey Success'
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}

module.exports = {
    postJourney, getJourneyByDriver , getJourneyByPassenger, getAllJourneyByPassenger, putJourney, postJourneybyuser
}