
const { request, response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const MySql = require('../DB/MySql');

//Router: add user, get user by id, put user
const addNewUser = async (req = request, res = response) => {

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

const getUserByPhone = async (req = request, res = response) => {

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
const updateUser = async (req = request, res = response) => {

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


module.exports = {
    addNewUser,
    getUserByPhone,
    updateUser
}