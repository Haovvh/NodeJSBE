
const {response, request} = require('express');
const MySql = require('../DB/MySql');
const bcrypt = require('bcrypt');
const { generarJsonWebToken } = require('../Helpers/JWToken');


const LoginUsuario = async ( req = request, res = response ) => {

    const { email, password } = req.body;

   try {

        const conn = await MySql();

        const existsEmail = await conn.query('SELECT id, email, password FROM users WHERE email = ? LIMIT 1', [ email ]);


        if( existsEmail[0].length === 0 ){
            conn.end();
            return res.status(400).json({
                resp: false,
                message : 'Wrong Credentials Hao'
            });
        }


        const validatedPassword = await bcrypt.compareSync( password, existsEmail[0][0].password );

        if( !validatedPassword ){

            conn.end();
            return res.status(400).json({
                resp: false,
                message: 'Wrong Credentials Teo'
            }); 
            
        }

        const token = await generarJsonWebToken( existsEmail[0][0].id );
                
        conn.end();
        return res.json({
            resp: true,
            message : 'Welcome to Hao Shop',
            token: token
        });

        

   } catch (err) {
        return res.status(500).json({
            resp: false,
            message : err
        });
   }
}

const RenweToken = async ( req = request , res = response ) => {


    const token = await generarJsonWebToken( req.uidPerson );
   
    return res.json({
        resp: true,
        message : 'Welcome to Frave Shop',
        token: token
    });
}


module.exports = {
    LoginUsuario,
    RenweToken,
};