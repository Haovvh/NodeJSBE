const { response, request } = require('express');
const MySql = require('../DB/MySql');

//getJourneyById, postJourney, putJourney

const getJourneyById = async (req = request, res = response) => {

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

const postJourney = async (req = request, res = response) => {

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

const putJourney = async (req = request, res = response) => {

    try {

        const { uidProduct } = req.body;

        const conn = await MySql();

        const isLike = await conn.query('SELECT COUNT(uidFavorite) isfavorite FROM favorite WHERE user_id = ? AND product_id = ?', [req.uidPerson, uidProduct]);

        if (isLike[0][0].isfavorite > 0) {

            await conn.query('DELETE FROM favorite WHERE user_id = ? AND product_id = ?', [req.uidPerson, uidProduct]);

            await conn.end();

            return res.json({
                resp: true,
                message: 'Unlike'
            });
        }

        await conn.query('INSERT INTO favorite (user_id, product_id) VALUE (?,?)', [req.uidPerson, uidProduct]);

        await conn.end();

        return res.json({
            resp: true,
            message: 'Like'
        });

    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}




module.exports = {
    getJourneyById,
    postJourney,
    putJourney

}