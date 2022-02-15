var jwt = require('jsonwebtoken');

const tokenSign = async (payload) =>{
    const secretKey = process.env.TOKEN_JWT;
    return await jwt.sign(payload,secretKey,{expiresIn:'1d'});
}

const verifyToken = async (token) => {
    const secretKey = process.env.TOKEN_JWT;
    try {
        return await jwt.verify(token,secretKey);
    } catch (error) {
        console.log(__filename+' -> '+error);
        return null;
    }
}

module.exports = {tokenSign, verifyToken}