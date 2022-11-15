const { request, response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const MySql = require('../DB/MySql');
const jwt = require('jsonwebtoken');
const {decodeToken} = require('../Middlewares/decodeToken')

//getUserById, postUser, changeFotoProfile, putUser
const postUser = async (req = request, res = response) => {

    try {
        const { password, username, email  } = req.body;    
        const salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync( password, salt );

        const conn = await MySql();

        const hasEmail = await conn.query('SELECT Email FROM Passengers WHERE Email = ?', [email]);

        if( hasEmail[0].length == 0 ){
            await conn.query(`INSERT INTO Passengers ( Fullname, 
                Email, Password ) VALUE (?,?,?);`, [ username, email, pass ]);

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
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
        }); 
    }
    
}
const putUserToSupportStaff = async (req = request, res = response) => {

    try {
        const Passenger_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        const { SupportStaffCode } = req.body;
        const conn = await MySql();
        if(SupportStaffCode === '20880254'){
            await conn.query(`UPDATE Passengers SET role = 'ROLE_SUPPORTSTAFF' WHERE Passenger_ID = ?`, [ Passenger_ID ]);
            conn.end();
            return res.json({
                
                resp: true,
                message : 'Role  success!'
            });
        } else {
            return res.json({
                resp: false,
                message : 'SupportStaff Code Wrong'
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

const putUser = async (req = request, res = response) => {

    try {
        const Passenger_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        const { Fullname, Phone, Date_of_birth } = req.body;
        const conn = await MySql();

        const hasPhone = await conn.query('SELECT Phone FROM Passengers WHERE Phone = ? AND Passenger_ID != ?', [Phone, Passenger_ID]);

        if( hasPhone[0].length == 0 ){
            
            await conn.query(`UPDATE Passengers SET Phone = ?, Date_of_birth = ?,  Fullname = ?
                WHERE Passenger_ID = ?`, [ Phone, Date_of_birth, Fullname, Passenger_ID ]);
            conn.end();

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
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
        }); 
    }
    
}


const getUser = async (req = request, res = response ) => {
    
    try {

        const user_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        
        const conn = await MySql();

        const rows = await conn.query(`SELECT Passenger_ID, Fullname, Phone, Date_of_birth, role FROM Passengers        
        WHERE Passenger_ID = ? `, [user_ID]);

        await conn.end();
        if(rows[0].length > 0) {
            
            return res.json({   
                resp: true,
                message: 'Get Passengers',
                data: rows[0][0]
            });
        }
        else {
            return res.json( {
                resp: false,
                message: 'No Passenger',
            })
        }
        
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
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
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
        }); 
    }
}

module.exports = {
    postUser,
    getUser,
    changeFotoProfile,
    putUser,
    putUserToSupportStaff
}