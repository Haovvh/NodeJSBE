
const { request, response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const MySql = require('../DB/MySql');

//addOnlineDriver, getOnlineDriver, putOnlineDriver
const addOnlineDriver = async (req = request, res = response) => {

    const { username, email, passwordd } = req.body;

    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync(passwordd, salt);

    const conn = await MySql();

    const hasEmail = await conn.query('SELECT Passenger_Email FROM users WHERE email = ?', [email]);

    if (hasEmail[0].length == 0) {

        await conn.query(`CALL SP_REGISTER_USER(?,?,?);`, [username, email, passwordd]);

        conn.end();

        return res.json({
            resp: true,
            message: 'User ' + username + 'is Success'
        });

    } else {
        return res.json({
            resp: false,
            message: 'Email already exists'
        });
    }

}

const getOnlineDriver = async (req = request, res = response) => {

    try {

        const conn = await MySql();

        const userdb = await conn.query(`CALL SP_GET_USER_BY_ID(?);`, [req.uidPerson]);

        conn.end();

        return res.json({
            resp: true,
            message: 'Get user by Id',
            user: userdb[0][0][0]
        });

    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

const putOnlineDriver = async (req = request, res = response) => {

    try {

        const conn = await MySql();

        const rows = await conn.query('SELECT image FROM person WHERE uid = ?', [req.uidPerson]);

        if (rows[0][0].image != null) {
            await fs.unlink(path.resolve('src/Uploads/Profile/' + rows[0][0].image));
        }

        await conn.query('UPDATE person SET image = ? WHERE uid = ?', [req.file.filename, req.uidPerson]);

        await conn.end();

        return res.json({
            resp: true,
            message: 'Updated image'
        });

    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}


module.exports = {
    addOnlineDriver,
    getOnlineDriver,
    putOnlineDriver
}