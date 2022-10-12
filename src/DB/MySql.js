require('dotenv').config()
const { createPool } = require('mysql2/promise');


module.exports = MySql = async () => {

    const connection = await createPool({
        host: process.env.DB_SERVER,
        user: process.env.DB_ID,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10
    });

    return connection;

}