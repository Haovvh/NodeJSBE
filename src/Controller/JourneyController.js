const { request, response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const MySql = require('../DB/MySql');
const {decodeToken} = require('../Middlewares/decodeToken')
const jwt = require('jsonwebtoken');
const { get } = require('http');

Date.prototype.addHours  = function() {
    this.setTime(this.getTime() );
    return this;
};

const postJourney = async (req = request, res = response) => {
    
    try {
        const {Passenger_ID, 
            User_ID, 
            SupportStaff_ID,
            driver_ID, 
            Price, 
            
            origin_Id, 
            origin_Fulladdress, 
            origin_lat, 
            origin_lng, 
            destination_Id, 
            destination_Fulladdress, 
            destination_lat, 
            destination_lng, 
            distance_km, 
            pointCode} = req.body;
            
        const conn = await MySql();
        var row;
        if(User_ID) {
            row = await conn.query(`SELECT * FROM journeys 
            WHERE User_ID = ? AND Status = ? `, [ User_ID, 'Create']);
        }
        else {
            row = await conn.query(`SELECT * FROM journeys 
            WHERE Passenger_ID = ? AND Status = ? `, [ Passenger_ID, 'Create']);
        } 
        //check xem tài xế đã nhận chuyến đi chưa?
        
        if( row[0].length === 0 ){
            await conn.query(`INSERT INTO journeys 
            ( Passenger_ID, User_ID, SupportStaff_ID, Driver_ID, Price, 
                origin_Id, origin_Fulladdress, origin_lat, 
                origin_lng, destination_Id, destination_Fulladdress, destination_lat, 
                destination_lng, 
                distance_km, pointCode) 
            VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?);`, 
            [Passenger_ID, User_ID, (SupportStaff_ID), parseInt(driver_ID), Price, 
                origin_Id, origin_Fulladdress, origin_lat, origin_lng, destination_Id, destination_Fulladdress, 
                destination_lat, destination_lng, 
                distance_km, pointCode]);

            conn.end();

            return res.json({
                resp: true,
                message : 'Create journey is success!',

            });
        
        } else {
            return res.json({
                resp: false,
                message : 'Accept the trip is failed.'
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
        const {driver_ID, 
            User_ID,
            SupportStaff_ID,
            Price, 
            origin_Id, 
            origin_Fulladdress, 
            destination_Id, 
            destination_Fulladdress, 
            distance_km, 
            pointCode} = req.body;    
        
        
        const conn = await MySql();
        //check xem tài xế đã nhận chuyến đi chưa?
        await conn.query(`INSERT INTO journeys 
            ( User_ID, SupportStaff_ID, Driver_ID, Price, origin_Id, 
                origin_Fulladdress, destination_Id, destination_Fulladdress, 
                distance_km, pointCode) 
            VALUE (?,?,?,?,?,?,?,?,?);`, 
            [User_ID,SupportStaff_ID, driver_ID, Price, origin_Id, 
                origin_Fulladdress, destination_Id, destination_Fulladdress, 
                distance_km, pointCode]);
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

//check lịch sử chuyến đi chưa thành công của driver
const getJourneyByDriver = async (req = request, res = response) => {    
    
    try {   
        const driver_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();
        const getalljourney = await conn.query(`SELECT journeys.pointCode, journeys.Price, 
        journeys.origin_Fulladdress , journeys.destination_Fulladdress,
        Passengers.Passenger_ID, Passengers.Fullname , Passengers.Phone ,
        SupportStaff_ID,
        Users.Fullname as FullnameUser, Users.Phone as PhoneUser
        FROM journeys 
        LEFT JOIN Passengers on (journeys.Passenger_ID = Passengers.Passenger_ID)
        LEFT JOIN Users on (journeys.User_ID = Users.User_ID)
        WHERE Driver_ID = ? AND Status = 'Create' `, [driver_ID]);        
        conn.end();
        if( getalljourney[0].length !== 0 ){  
            if(!getalljourney[0][0].Passenger_ID) {
                console.log("Passenger ID")
                getalljourney[0][0].Fullname = getalljourney[0][0].FullnameUser;
                getalljourney[0][0].Phone = getalljourney[0][0].PhoneUser
    
            } 
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
            message: error
        });
    }
    

}
//Lịch sử chuyến đi chưa thành công của Passenger
const getJourneyByPassenger = async (req = request, res = response) => {    
    
    try {   
        const Passenger_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
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

        if( getalljourney[0].length !== 0 ){        

            return res.json({
                resp: true,
                message : 'Get journey is success!',
                data: getalljourney[0][0]
            });
        
        } else {
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

//Lịch sử các chuyến đi của Passenger
const getAllJourneyByPassengerID = async (req = request, res = response) => {    
    
    try {   
        const Passenger_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();
        
        const getalljourney = await conn.query(`
        SELECT Passengers.Fullname, origin_Fulladdress, destination_Fulladdress, 
        Price, distance_km, start_time, finish_time
        FROM journeys LEFT JOIN Passengers on (journeys.Driver_ID = Passengers.Passenger_ID)
        WHERE journeys.Passenger_ID = ? AND Status = 'Success'         
        `, [Passenger_ID]);        
        conn.end();

        
        if( getalljourney[0].length !== 0 ){ 
            for(let i =0 ; i<getalljourney[0].length; i++) {
                getalljourney[0][i].start_time.addHours();
                getalljourney[0][i].finish_time.addHours();
    
                getalljourney[0][i].start_time = getalljourney[0][i].start_time.toLocaleString();
                getalljourney[0][i].finish_time = getalljourney[0][i].finish_time.toLocaleString();
            }
            return res.json({
                resp: true,
                message : 'Get journey is success!',
                data: getalljourney[0]
            });
        
        } else {
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

//Lịch sử chuyến đi của Driver
const getAllJourneyByDriverID = async (req = request, res = response) => {    
    
    try {   
        console.log("getAllJourneyByDriverID")
        const Driver_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();
        
        let getalljourney = await conn.query(`
        SELECT Passengers.Fullname, origin_Fulladdress, destination_Fulladdress, 
        Price, distance_km, start_time, finish_time
        FROM callcenterdb.journeys 
        LEFT JOIN callcenterdb.Passengers on (journeys.Passenger_ID = Passengers.Passenger_ID)
        WHERE journeys.Driver_ID = ? AND Status = 'Success'         
        `, [Driver_ID]);        
        conn.end();
        
        
        
        console.log( getalljourney[0][0])
        if( getalljourney[0].length !== 0 ){     
            for(let i =0 ; i<getalljourney[0].length; i++) {
                getalljourney[0][i].start_time.addHours();
                getalljourney[0][i].finish_time.addHours();
    
                getalljourney[0][i].start_time = getalljourney[0][i].start_time.toLocaleString();
                getalljourney[0][i].finish_time = getalljourney[0][i].finish_time.toLocaleString();
            }
            console.log( getalljourney[0])
            return res.json({
                resp: true,
                message : 'Get journey is success!',
                data: getalljourney[0]
            });
        
        } else {
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

//Lịch sử điều phối của Support Staff
const getAllJourneyBySupportStaff = async (req = request, res = response) => {    
    
    try {   
        const SupportStaff_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();
        
        const getalljourney = await conn.query(`
        SELECT Passengers.Fullname as FullnameDriver, users.Fullname as FullnameUser , 
        origin_Fulladdress, destination_Fulladdress, Price, distance_km, start_time, finish_time
        FROM journeys 
        LEFT JOIN Passengers on (journeys.Driver_ID = Passengers.Passenger_ID)
        LEFT JOIN Users on (users.User_ID = journeys.User_ID)
        WHERE journeys.SupportStaff_ID = ? AND   Status = 'Success'         
        `, [SupportStaff_ID]);        
        conn.end();
        
        if( getalljourney[0].length !== 0 ){       
            for(let i =0 ; i<getalljourney[0].length; i++) {
                getalljourney[0][i].start_time.addHours();
                getalljourney[0][i].finish_time.addHours();
    
                getalljourney[0][i].start_time = getalljourney[0][i].start_time.toLocaleString();
                getalljourney[0][i].finish_time = getalljourney[0][i].finish_time.toLocaleString();
            }
            console.log(getalljourney[0])
            return res.json({
                resp: true,
                message : 'Get journey is success!',
                data: getalljourney[0]
            });
        
        } else {
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

//Top 5 địa điểm thường đi của Passenger
const getAllJourneyByPassenger = async (req = request, res = response) => {    
    
    try {   
        const Passenger_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();
        
        const getalljourney = await conn.query(`
        SELECT origin_Fulladdress as origin_Fulladdress, COUNT(origin_Id) AS Count
        FROM journeys 
        WHERE Passenger_ID = ? AND   Status = 'Success' 
        GROUP BY origin_Fulladdress 
        ORDER BY Count DESC
        LIMIT 5
        `, [ Passenger_ID]);      
        const destination = await conn.query(`
        
        SELECT destination_Fulladdress as destination_Fulladdress, COUNT(destination_Id) AS Count
        FROM journeys 
        WHERE Passenger_ID = ? AND   Status = 'Success' 
        GROUP BY destination_Fulladdress
        ORDER BY COUNT DESC
        LIMIT 5
        `, [ Passenger_ID]);   
        conn.end();

        console.log(getalljourney[0])
        if( getalljourney[0].length > 0  && destination[0].length > 0){        

            return res.json({
                resp: true,
                message : 'Get journey is success!',
                origin: getalljourney[0],
                destination: destination[0]
            });
        
        } else {
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


//Cập nhật chuyến đi thành công từ driver
const putJourney = async (req = request, res = response ) => {

    try {
        console.log("put journey")
        const {driver_ID, SupportStaff_ID} = req.body;
        
        console.log(req.body);
        const conn = await MySql();

        await conn.query(`UPDATE journeys SET Status = ? , finish_time = ?, 
        SupportStaff_ID = ? WHERE driver_ID = ? AND Status = ?`, 
        ['Success', new Date(),SupportStaff_ID, driver_ID,  'Create']);

        conn.end();

        return res.json({
            resp: true,
            message: 'Update journey Success'
        });
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}

module.exports = {
    postJourney, 
    getJourneyByDriver, 
    getAllJourneyByPassengerID,
    getAllJourneyBySupportStaff,
    getAllJourneyByDriverID,
    getJourneyByPassenger, 
    getAllJourneyByPassenger, 
    putJourney, 
    postJourneybyuser
}