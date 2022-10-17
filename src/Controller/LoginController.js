
const {response, request} = require('express');
const MySql = require('../DB/MySql');
const bcrypt = require('bcrypt');
const { generarJsonWebToken } = require('../Helpers/JWToken');


const LoginUser = async ( req = request, res = response ) => {

    const { email, passwordd } = req.body;

   try {

        const conn = await MySql();

        const existsEmail = await conn.query('SELECT id, email, passwordd FROM customer WHERE email = ? LIMIT 1', [ email ]);


        if( existsEmail[0].length === 0 ){
            conn.end();
            return res.status(400).json({
                resp: false,
                message : 'Wrong Credentials'
            });
        }


        const validatedPassword = await bcrypt.compareSync( passwordd, existsEmail[0][0].passwordd );

        if( !validatedPassword ){

            conn.end();
            return res.status(400).json({
                resp: false,
                message: 'Wrong Credentials'
            }); 
            
        }

        const token = await generarJsonWebToken( existsEmail[0][0].id );
                
        conn.end();
        return res.json({
            resp: true,
            message : 'Welcome GoCar App',
            token: token
        });

        

   } catch (err) {
        return res.status(500).json({
            resp: false,
            message : err
        });
   }
}

const RenewToken = async ( req = request , res = response ) => {


    const token = await generarJsonWebToken( req.uidPerson );
   
    return res.json({
        resp: true,
        message : 'Welcome GoCar App',
        token: token
    });
}


module.exports = {
    LoginUser,
    RenewToken,
};