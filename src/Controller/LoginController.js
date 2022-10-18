
const {response, request} = require('express');
const MySql = require('../DB/MySql');
const bcrypt = require('bcrypt');
const { generarJsonWebToken } = require('../Helpers/JWToken');


const LoginUsuario = async ( req = request, res = response ) => {

    const { email, password } = req.body;

   try {

        const conn = await MySql();
        console.log("success")
        const existsEmail = await conn.query('SELECT users.id, users.email, users.password, roles.name FROM users LEFT JOIN userrole ON (users.id = userrole.userId) LEFT JOIN roles on (roles.roleId = userrole.roleId) WHERE email = ? LIMIT 1', [ email ]);
        //console.log(existsEmail);

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
            accessToken: token,
            id: existsEmail[0][0].id,
            roles: existsEmail[0][0].name
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
        accessToken: token
    });
}


module.exports = {
    LoginUsuario,
    RenweToken,
};