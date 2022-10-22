
const { request, response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const MySql = require('../DB/MySql');
const {decodeToken} = require('../Middlewares/decodeToken')
const jwt = require('jsonwebtoken');


const addNewUser = async (req = request, res = response) => {

    const { password, username, email,  } = req.body;    
    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync( password, salt );

    const conn = await MySql();

    const hasEmail = await conn.query('SELECT Passenger_Email FROM Passengers WHERE Passenger_Email = ?', [email]);

    if( hasEmail[0].length == 0 ){
        await conn.query(`INSERT INTO Passengers ( Passenger_Name, Passenger_Email, Passenger_Pass ) VALUE (?,?,?);`, [ username, email, pass ]);

        conn.end();

        return res.json({
            resp: true,
            message : 'Email ' + email +' success!'
        });
    
    } else {
        return res.json({
            resp: false,
            message : 'Email already exists'
        }); 
    }

}
const createjourney = async (req = request, res = response) => {
    
    const { origin, destionation, Price, distance_km, journey_pointCode} = req.body;    
    const token = req.header('x-access-token');
    if( token ){
        const verified  = jwt.verify( token, process.env.KEY_JWTOKEN );
        console.log(verified.id)
        
    }
    const Passenger_ID =   decodeToken(token).id;
    
    const conn = await MySql();

    const isOnlineDriver = await conn.query('SELECT * FROM online_driver ');
    console.log(isOnlineDriver[0][0])
    if( isOnlineDriver ){
        await conn.query(`INSERT INTO journeys 
        ( Passenger_ID, Driver_ID, Price, LocationID_FROM, LocationID_TO, journey_StatusId, journey_pointCode, distance_km, start_time) 
        VALUE (?,?,?,?,?,?,?,?,?);`, [Passenger_ID, isOnlineDriver[0][0].Driver_ID, Price,1 ,1 , 1,'', distance_km, new Date()]);

        conn.end();

        return res.json({
            resp: true,
            message : 'Create journey is success!',

        });
    
    } else {
        return res.json({
            resp: false,
            message : 'False'
        }); 
    }

}
const getAllJourneybyId = async (req = request, res = response) => {    
    
    const token = req.header('x-access-token');
    if( token ){
        const verified  = jwt.verify( token, process.env.KEY_JWTOKEN );
        console.log(verified.id)
        
    }
    const Passenger_ID =   decodeToken(token).id;
    
    const conn = await MySql();

    const getalljourney = await conn.query('SELECT * FROM journey WHERE Passenger_ID = ?', [Passenger_ID]);
    console.log(getalljourney[0][0])
    conn.end();
    if( getalljourney ){        
        return res.json({
            resp: true,
            message : 'Create journey is success!',
            data: getalljourney[0][0]

        });
    
    } else {
        return res.json({
            resp: false,
            message : 'False'
        }); 
    }

}

const getUserById = async (req = request, res = response ) => {

    try {

        const conn = await MySql();

        const userdb = await conn.query(`CALL SP_GET_USER_BY_ID(?);`, [ req.uidPerson ]);

        conn.end();

        return res.json({
            resp: true,
            message: 'Get user by Id',
            user: userdb[0][0][0]
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

const changeFotoProfile = async ( req = request, res = response ) => {

    try {

        const conn = await MySql();

        const rows = await conn.query('SELECT image FROM person WHERE uid = ?', [ req.uidPerson ]);

        if( rows[0][0].image != null ){
            await fs.unlink(path.resolve('src/Uploads/Profile/' + rows[0][0].image));
        }

        await conn.query('UPDATE person SET image = ? WHERE uid = ?', [ req.file.filename, req.uidPerson ]);

        await conn.end();
        
        return res.json({
            resp: true,
            message: 'Updated image'
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        }); 
    }
}

const updateInformationUser = async ( req = request, res = response ) => {

    try {

        const { firstname, lastname, phone, address, reference } = req.body;

        const conn = await MySql();

        await conn.query(`CALL SP_UPDATE_INFORMATION(?,?,?,?,?,?);`, [ req.uidPerson, firstname, lastname, phone, address, reference ]);

        await conn.end();

        return res.json({
            resp: true,
            message: 'Infomation personal added'
        });
        
    } catch (err) {
        return res.json({
            resp: false,
            message: err
        });
    }
}

const updateStreetAddress = async ( req, res = response ) => {

   try {

        const { address, reference } = req.body;
        
        const conn = await MySql();

        await conn.query(`CALL SP_UPDATE_STREET(?,?,?);`, [ req.uidPerson, address, reference ]);

        await conn.end();
        
        return res.json({
            resp: true,
            message: 'Street Address updated',
        });
        
    } catch (err) {
       return res.status(500).json({
           resp: false,
           message: err,
       });
   }

}


module.exports = {
    addNewUser,
    getUserById,
    changeFotoProfile,
    updateInformationUser,
    updateStreetAddress,
    createjourney,
    getAllJourneybyId
}