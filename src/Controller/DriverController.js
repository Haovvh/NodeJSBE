const { response, request } = require('express');
const MySql = require('../DB/MySql');
const {decodeToken} = require('../Middlewares/decodeToken')
//getDriver, postDriver, putDriver
const roles = ['ROLE_PASSENGER','ROLE_DRIVER','ROLE_SUPPORTSTAFF'];
const getDriver = async (req = request, res = response) => { 
   
    try {
        const _id = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id

        const conn = await MySql();

        const rows = await conn.query(`SELECT * FROM Drivers 
        LEFT JOIN Passengers on (Passengers.Passenger_ID = Drivers.Driver_ID)
        WHERE Driver_ID = ?`, [_id]);
        console.log(rows[0][0])
        await conn.end();

        return res.json({
            resp: true,
            message: 'Get Drivers',
            data: rows[0][0]
        });

    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

const postDriver = async (req = request, res = response) => {
    
    try {
        console.log("Vao post Driver")
        const Driver_ID = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        const { Car_code, Car_color, Car_owner, Car_seat, Car_type } = req.body;        
        console.log(req.body)
        const conn = await MySql();
        await conn.query(`INSERT INTO Drivers ( Driver_ID, Car_code, Car_color, Car_owner, Car_seat, Car_type ) 
        VALUES (? , ? , ? , ? , ? , ? ) `, 
        [ Driver_ID, Car_code, Car_color, Car_owner,Number(Car_seat) , Car_type ]);
        await conn.query(`UPDATE Passengers SET role = ? WHERE Passenger_ID = ? `, [ roles[1], Driver_ID ])

        conn.end();

        return res.json({
            resp: true,
            message : 'Create Driver success!'
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            resp: false,
            message: err
        });
    } 
}

const putDriver = async (req = request, res = response) => {

    
    try {
        const _id = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        const {carOwner, carCode, carType, carSeat, carColor } = req.body;        

        const conn = await MySql();
        await conn.query(`UPDATE Drivers SET car_owner = ? , car_type = ?, car_code = ? , car_seat = ? , car_color = ?
        WHERE (Driver_ID = ?)`, [carOwner, carType, carCode, carSeat, carColor, _id ]);
        
        conn.end();
        return res.json({
            resp: true,
            message : 'Update Driver success!'
        });
        
    } catch (error) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    } 

}

module.exports = {
    getDriver, postDriver, putDriver
}