const {response, request } = require('express');
const { verifyToken } = require('../helpers/jwt');


function redirectLogin(req = request, res = response, next){
    if(!req.session.userId){
        res.redirect('/login');
    }else{
        next();
    }
}

async function isAuthenticate(req = request, res = response, next){
    try {
        const {token_session} = req.cookies;
        if(!token_session){
            res.redirect('/login');
            return;
        }
        const verify = await verifyToken(token_session);
        if(verify?.id && verify?.rol){
            next();
        }else{
            res.clearCookie('token_session');
            res.redirect('/login');
        }
    } catch (error) {
        console.log(__filename+' --> '+error);
        res.send('<h1>Error 500</h1>');
    }
}

async function redirectHome(req = request, res = response, next){
    try {
        const {token_session} = req.cookies;
        if(!token_session){
            next();
            return;
        }
        const verify = await verifyToken(token_session);
        if(verify?.id){
            res.redirect('/');
        }else{
            res.clearCookie('token_session');
            res.redirect('/login');
        }
    } catch (error) {
        res.clearCookie('token_session');
        console.log(__filename+' --> '+error);
        res.send('<h1>Error 500</h1>');
    }
}

module.exports = {redirectLogin, isAuthenticate, redirectHome}