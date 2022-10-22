const jwt = require('jsonwebtoken');



const generarJsonWebToken = ( id, pass, roles, email ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { id, pass, roles, email };

        jwt.sign( payload, process.env.KEY_JWTOKEN, { 
            expiresIn: '1h'
        }, ( err, token ) => {

            if( !err ){ 
                resolve( token ); 
            }
            else {
                reject( 'No generar Token' ); 
            }
        });

    });   
}

module.exports = {
    generarJsonWebToken,
}