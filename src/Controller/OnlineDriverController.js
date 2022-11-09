const { response, request } = require('express');
const MySql = require('../DB/MySql');
const {decodeToken} = require('../Middlewares/decodeToken')
//getDriver, postDriver, putDriver


const putOnlineDriver = async (req = request, res = response) => {

    
    try {
        console.log("putOnlineDriver")
        const _id = decodeToken(req.header('x-access-token'), process.env.KEY_JWTOKEN).id
        const {Status} = req.body;        
        console.log(Status)
        const conn = await MySql();
        await conn.query(`UPDATE online_driver SET  Status = ? 
        WHERE (Driver_ID = ?)`, [Status, _id ]);
        
        conn.end();
        return res.json({
            resp: true,
            message : 'Update Status success!'
        });
        
    } catch (error) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    } 

}

module.exports = {
    putOnlineDriver
}