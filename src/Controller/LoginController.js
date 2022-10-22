
const {response, request} = require('express');
const MySql = require('../DB/MySql');
const bcrypt = require('bcrypt');
const { generarJsonWebToken } = require('../Helpers/JWToken');


const Login = async ( req = request, res = response ) => {

    const { email, password } = req.body;    

   try {

        const conn = await MySql();
        
        const existsEmail = await conn.query('SELECT Passengers.Passenger_ID, Passengers.Passenger_Name, Passengers.Passenger_Email, Passengers.Passenger_Pass, roles.name FROM Passengers LEFT JOIN userrole ON (Passengers.Passenger_ID = userrole.Passenger_ID) LEFT JOIN roles on (roles.roleId = userrole.roleId) WHERE Passengers.Passenger_Email = ? LIMIT 1', [ email ]);
       

        if( existsEmail[0].length === 0 ){
            conn.end();
            return res.status(400).json({
                resp: false,
                message : 'Email is Use'
            });
        }


        const validatedPassword = await bcrypt.compareSync( password, existsEmail[0][0].Passenger_Pass );

        if( !validatedPassword ){

            conn.end();
            return res.status(400).json({
                resp: false,
                message: 'Wrong Password'
            }); 
            
        }

        const token = await generarJsonWebToken( existsEmail[0][0].Passenger_ID,existsEmail[0][0].Passenger_Pass, existsEmail[0][0].name,existsEmail[0][0].Passenger_Email);
                
        conn.end();
        return res.json({
            resp: true,
            message : 'Welcome to Go Car VietNam',
            accessToken: token,
            id: existsEmail[0][0].Passenger_ID,
            roles: existsEmail[0][0].name,
            name: existsEmail[0][0].Passenger_Name
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
        message : 'Welcome to Go Car VietNam',
        accessToken: token
    });
}


module.exports = {
    Login,
    RenweToken,
};