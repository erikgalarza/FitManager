const { response, request } = require('express');
const { verifyToken } = require('../helpers/jwt');

const checkRoleAuth = (roles) => async (req = request, res = response, next) => {
    try {
        const { token_session } = req.cookies;
        const tokenAux = await verifyToken(token_session);
        const listRoles = [...roles];
        req.userLoged = {
            id: tokenAux.id,
            rol: tokenAux.rol,
            name: tokenAux.name,
            email: tokenAux.email,
        }
        if (listRoles.includes(tokenAux.rol)) {
            next();
        } else {
            if (tokenAux.rol == 'cliente') {
                res.redirect('/');
            } else if (tokenAux.rol == 'admin') {
                res.redirect('/inicio-admin')
            }
        }
    } catch (error) {
        console.log(__filename+' --> '+error);
        res.send('<h1>Error 500</h1>');
    }
}

module.exports = { checkRoleAuth }
