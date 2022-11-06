const jwt = require('jsonwebtoken');



const generarJsonWebToken = ( id, password,Fullname, Email , role ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { id, password, Fullname, Email, role };

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