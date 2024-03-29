const { response, request } = require('express');
const MySql = require('../DB/MySql');
const {decodeToken} = require('../Middlewares/decodeToken')
//getDriver, postDriver, putDriver
const roles = ['ROLE_PASSENGER','ROLE_DRIVER','ROLE_SUPPORTSTAFF'];

const getDriver = async (req = request, res = response) => { 
   
    try {
        const _id = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id

        const conn = await MySql();

        const rows = await conn.query(`SELECT online_driver.Status, Passengers.Fullname, 
        Passengers.Date_of_birth, Passengers.Phone, Drivers.* FROM Drivers 
        LEFT JOIN Passengers on (Passengers.Passenger_ID = Drivers.Driver_ID)
        LEFT JOIN online_driver on (online_driver.Driver_ID = Drivers.Driver_ID)
        WHERE Drivers.Driver_ID = ? `, [_id]);
        await conn.end();
        
        return res.json({
            resp: true,
            message: 'Get Drivers',
            data: rows[0][0]
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
        });
    }
}

const postDriver = async (req = request, res = response) => {
    
    try {
        const Driver_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        const { Car_code, Car_color, Car_owner, Car_seat, Car_type } = req.body;        
        console.log(req.body)
        const conn = await MySql();
        await conn.query(`INSERT INTO Drivers ( Driver_ID, Car_code, Car_color, Car_owner, Car_seat, Car_type ) 
        VALUES (? , ? , ? , ? , ? , ? ) `, 
        [ Driver_ID, Car_code, Car_color, Car_owner, Car_seat , Car_type ]);
        await conn.query(`INSERT INTO online_driver (Driver_ID, LNG, LAT, Car_seat) Values ( ? , ? , ? , ?) `,
         [Driver_ID, 0, 0, Car_seat]);
        await conn.query(`UPDATE Passengers SET role = ? WHERE Passenger_ID = ? `, [ roles[1], Driver_ID ])

        conn.end();

        return res.json({
            resp: true,
            message : 'Create Driver success!'
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            resp: false,
            message: error
        });
    } 
}

const putDriver = async (req = request, res = response) => {

    
    try {
        const _id = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        const {Phone,Fullname, Date_of_birth, Car_owner,Car_type,Car_code,Car_color} = req.body;        

        const conn = await MySql();
        await conn.query(`UPDATE Drivers SET  Car_owner = ?, Car_type = ?,Car_code = ?,Car_color = ? 
        WHERE (Driver_ID = ?)`, [Car_owner, Car_type, Car_code, Car_color, _id ]);
        
        conn.end();
        return res.json({
            resp: true,
            message : 'Update Driver success!'
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
    getDriver, postDriver, putDriver
}