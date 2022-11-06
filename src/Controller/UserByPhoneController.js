const { request, response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const MySql = require('../DB/MySql');
const jwt = require('jsonwebtoken');
const {decodeToken} = require('../Middlewares/decodeToken');
const { Console } = require('console');

//getUserById, postUser, changeFotoProfile, putUser
const postUserbyPhone = async (req = request, res = response) => {

    try {
        console.log("post User")
        const { Fullname, Phone, Date_of_birth } = req.body;
        console.log(req.body)
        const conn = await MySql();

        const hasPhone = await conn.query(`SELECT Phone FROM Users WHERE Phone = ? `, [Phone]);

        console.log(hasPhone[0])
        if( hasPhone[0].length == 0 ){
            
            await conn.query(`INSERT INTO Users (Phone, Fullname, Date_of_birth)
            VALUES (?, ? ,?)
            `, [ Phone,  Fullname, Date_of_birth ]);
            conn.end();
            console.log("True")
            return res.json({                
                resp: true,
                message : 'Add User success!'
            });
        
        } else {
            console.log("False")
            return res.json({
                resp: false,
                message : 'Phone already exists'
            }); 
        }
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            resp: false,
            message: err
        }); 
    }
    
}


const putUserbyPhone = async (req = request, res = response) => {

    try {
        console.log("put User")
        const Passenger_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        const { Fullname, Phone, Date_of_birth } = req.body;
        console.log(req.body)
        const conn = await MySql();

        const hasPhone = await conn.query('SELECT Phone FROM Passengers WHERE Phone = ? AND Passenger_ID != ?', [Phone, Passenger_ID]);
        console.log(hasPhone[0])
        if( hasPhone[0].length == 0 ){
            
            await conn.query(`UPDATE Passengers SET Phone = ?, Date_of_birth = ?,  Fullname = ?
                WHERE Passenger_ID = ?`, [ Phone, Date_of_birth, Fullname, Passenger_ID ]);
            conn.end();
            console.log("True")
            return res.json({
                
                resp: true,
                message : 'Phone  success!'
            });
        
        } else {
            console.log("False")
            return res.json({
                resp: false,
                message : 'Phone already exists'
            }); 
        }
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            resp: false,
            message: err
        }); 
    }
    
}


const getUserbyPhone = async (req = request, res = response ) => {
    
    try {
        console.log("get User by Phone")
        const {Phone} = req.params;
        
        const role = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).role
        if (!role.includes('ROLE_SUPPORTSTAFF')) {
            console.log("Không có quyền Support Staff")
            return res.json( {
                resp: false,
                message: 'No Support Staff',
            })
        }
        const conn = await MySql();
        console.log(Phone)
        const rows = await conn.query(`SELECT User_ID, Fullname, Date_of_birth FROM users WHERE Phone = ? `, [Phone]);
        console.log(rows[0])
        if(rows[0].length === 0) {
            console.log("No user")
            await conn.end()
            return res.json( {
                resp: false,
                message: 'No Users'
            })            
        }
        const address = await conn.query(`SELECT start_time, origin_Fulladdress, destination_Fulladdress 
        FROM journeys WHERE User_ID = ? ORDER BY start_time DESC
        `,[parseInt(rows[0][0].User_ID)])
        console.log(address[0])
        const countPlace = await conn.query(`
        SELECT origin_Fulladdress, COUNT(origin_Id) AS Count
        FROM journeys 
        WHERE User_ID = ? AND   Status = 'Success' 
        GROUP BY origin_Id 
        union
        SELECT destination_Fulladdress, COUNT(destination_Id) AS Count
        FROM journeys 
        WHERE User_ID = ? AND   Status = 'Success' 
        GROUP BY destination_Id
        ORDER BY COUNT DESC
        LIMIT 5
        `,[parseInt(rows[0][0].User_ID), parseInt(rows[0][0].User_ID)])
        await conn.end();
        console.log(countPlace[0])
        
        console.log("Có User");
        return res.json({
            resp: true,
            message: 'Get Users',
            data: rows[0][0],
            address: address[0],
            count: countPlace[0]
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
    postUserbyPhone,
    getUserbyPhone,
    putUserbyPhone,
}