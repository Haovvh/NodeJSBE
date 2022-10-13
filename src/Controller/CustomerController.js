const { response, request } = require('express');
const MySql = require('../DB/MySql');



const getCustomer = async (req = request, res = response) => {

    try {

        const conn = await MySql();

        const rows = await conn.query('SELECT * FROM Home_carousel');

        await conn.end();

        return res.json({
            resp: true,
            message: 'Get List products home',
            slideProducts: rows[0]
        });

    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

const getAllJourney = async (req = request, res = response) => {

    try {

        const conn = await MySql();

        const products = await conn.query(`CALL SP_LIST_PRODUCTS_HOME(?);`, [req.uidPerson]);

        await conn.end();

        return res.json({
            resp: true,
            message: 'Get List Products for Home',
            listProducts: products[0][0]
        });

    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}



const postCustomer = async (req = request, res = response) => {

    try {

        const { name, description, stock, price, uidCategory } = req.body;

        const conn = await MySql();

        await conn.query('INSERT INTO Products (nameProduct, description, codeProduct, stock, price, picture, category_id) VALUE (?,?,?,?,?,?,?)',
            [name, description, '000' + name, stock, price, req.file.filename, uidCategory]);

        await conn.end();

        return res.json({
            resp: true,
            message: 'Product Added'
        })

    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}
const putCustomer = async (req = request, res = response) => {

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
const putJourney = async (req = request, res = response) => {

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
    getCustomer,
    postCustomer,
    putCustomer,
    getAllJourney,
    putJourney
}