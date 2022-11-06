const jwt = require('jsonwebtoken');

const validateToken = ( req, res, next ) => {    
    let token = req.header('x-access-token');
    if( !token ){
        console.log("No Token")
        return res.status(401).json({
            resp: false,
            message : "There is not Token in the request"
        });    
    }
    try {
        // -----------------------------------Add key Jwt TOKEN
        const verified  = jwt.verify( token, process.env.KEY_JWTOKEN );
        
        if(verified) {
            next()            
        }else{
            // Access Denied
            return res.status(401).json({
                resp: false,
                message : 'Wrong Token',
            })
        }        
        
    } catch (e) {
        return res.status(401).json({
            resp: false,
            message : 'Invalid Token',
        });
    }
}

module.exports = {
    validateToken
}