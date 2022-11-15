const {response, request} = require('express');
const MySql = require('../DB/MySql');
const bcrypt = require('bcrypt');
const { generarJsonWebToken } = require('../Helpers/JWToken');


const Login = async ( req = request, res = response ) => {

   try {
        const { password, email } = req.body;    
        const conn = await MySql();        
        const existsEmail = await conn.query(`SELECT Passenger_ID, 
        Fullname, Email, Password, Phone, role 
        FROM Passengers WHERE Email = ? LIMIT 1`, [ email ]);       

        if( existsEmail[0].length === 0 ){
            conn.end();
            return res.status(400).json({
                resp: false,
                message : 'Wrong Email'
            });
        }
        const validatedPassword = await bcrypt.compareSync( password, existsEmail[0][0].Password );

        if( !validatedPassword ){

            conn.end();
            return res.status(400).json({
                resp: false,
                message: 'Wrong Password'
            }); 
            
        }
        //id, password, role, Email
        const token = await generarJsonWebToken( existsEmail[0][0].Passenger_ID,existsEmail[0][0].Password,
             existsEmail[0][0].Fullname,existsEmail[0][0].Email,existsEmail[0][0].role);    
        conn.end();
        
        return res.json({
            resp: true,
            message : 'Welcome Go Car VietNam',
            accessToken: token,
            id: existsEmail[0][0].Passenger_ID,
            role: existsEmail[0][0].role,
            name: existsEmail[0][0].Fullname,
            Phone: (existsEmail[0][0].Phone != null)
        });       

   } catch (error) {
    console.log(error)
        return res.status(500).json({
            resp: false,
            message : error
        });
   }
}
const changePassword = async ( req = request, res = response ) => {

    const { email, password } = req.body;    

   try {
        const conn = await MySql();        
        const existsEmail = await conn.query(`SELECT Passengers.Passenger_ID, 
        Passengers.Fullname, Passengers.Email, Passengers.Password, 
        Passengers.role FROM Passengers WHERE Passengers.Email = ? LIMIT 1`, [ email ]);       

        if( existsEmail[0].length === 0 ){
            conn.end();
            return res.status(400).json({
                resp: false,
                message : 'Wrong Email'
            });
        }

        const validatedPassword = await bcrypt.compareSync( password, existsEmail[0][0].Password );

        if( !validatedPassword ){

            conn.end();
            return res.status(400).json({
                resp: false,
                message: 'Wrong Password'
            }); 
            
        }

        const token = await generarJsonWebToken( existsEmail[0][0].Passenger_ID,existsEmail[0][0].Password,
             existsEmail[0][0].name,existsEmail[0][0].Email);
                
        conn.end();
        return res.json({
            resp: true,
            message : 'Welcome Go Car VietNam',
            accessToken: token,
            id: existsEmail[0][0].Passenger_ID,
            role: existsEmail[0][0].role,
            name: existsEmail[0][0].Fullname
        });       

   } catch (error) {
    console.log(error)
        return res.status(500).json({
            resp: false,
            message : error
        });
   }
}

const RenweToken = async ( req = request , res = response ) => {
    
    const token = await generarJsonWebToken( req.id );
   
    return res.json({
        resp: true,
        message : 'Welcome Go Car VietNam',
        accessToken: token
    });
}


module.exports = {
    Login,
    changePassword,
    RenweToken,
};