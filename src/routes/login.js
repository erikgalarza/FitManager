const { Router, response, request} = require('express');
const { loginClient, loginAdmin } = require('../logic/loginController');
const { checkRoleAuth } = require('../middleware/roleAuth');
const { isAuthenticate, redirectHome } = require('../middleware/session');

const router = Router();

//TODO Eliminar valores por defecto
//TODO del login

const optionSweetAlert =(icon, title, text, timer = 3000) => {
    const op = {
        icon,
        title,
        text,
        timer
    }
    return op;
}

router.get('/', redirectHome, (req = request, res = response) =>{
    const [err] = req.flash('type-error');
    let sweetOp = {alert: false};
    if(err == '403'){
        sweetOp = optionSweetAlert('warning','Oops...','El correo o la contraseña no son correctos');
        sweetOp.alert = true;
    }else if(err == '500'){
        sweetOp = optionSweetAlert('error','Oops...','Parece que hubo un error interno');
        sweetOp.alert = true;
    }
    res.render('login',sweetOp);
});

router.get('/logout',isAuthenticate, (req = request, res = response) =>{
    res.clearCookie('token_session');
    return res.redirect('/login');
});

router.post('/user', redirectHome, loginClient);

router.post('/admin',redirectHome, loginAdmin)


module.exports = router;