// const e = require('express');
const { response, request } = require('express')
const { getClientByEmail, getAdminByEmail } = require("../data/loginModel");
const { verifyPassword } = require('../helpers/handleBcrypt');
const { tokenSign } = require('../helpers/jwt');


async function loginClient(req = request, res = response, next) {
    const { correo, password } = req.body;
    try {
        const { data: cliente } = await getClientByEmail(correo);

        if (cliente.length == 1) {
            const hash = cliente[0].password;
            const match = verifyPassword(password, hash);
            if (match) {
                const payloadToken = {
                    rol: 'cliente',
                    id: cliente[0].cedula,
                    name: cliente[0].nombres,
                    email: cliente[0].correo,
                }
                const token = await tokenSign(payloadToken);
                res.cookie('token_session', token);
                res.redirect('/');
            } else {
                req.flash('type-error', "403");
                res.redirect('/login');
            }
        } else {
            req.flash('type-error', "403");
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error)
        req.flash('type-error', "500");
        res.redirect('/login');
    }
}

async function loginAdmin(req = request, res = response, next) {
    const { correo, password } = req.body;
    try {
        const { data } = await getAdminByEmail(correo);
        const admin = data[0];
        if (data.length == 1) {
            const hash = admin.password;
            const match = verifyPassword(password, hash);
            if (match) {
                const payloadToken = {
                    rol: 'admin',
                    id: admin.id_administrador,
                    name: admin.nombres,
                    email: admin.correo,
                }
                const token = await tokenSign(payloadToken);
                res.cookie('token_session', token);
                res.redirect('/');
            } else {
                req.flash('type-error', "403");
                res.redirect('/login');
            }
        } else {
            req.flash('type-error', "403");
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error)
        req.flash('type-error', "500");
        res.redirect('/login');
    }
}


module.exports = { loginClient, loginAdmin };