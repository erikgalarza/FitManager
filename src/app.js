const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const path = require("path");
const morgan = require('morgan');
const flash = require('connect-flash');
require("dotenv").config();
const { verificarfecha } = require('../src/logic/IMembresiaDAO');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public/')));
app.use(cookieParser());
app.use(session({
    secret: process.env.TOKEN_SESSION, 
    resave: false, 
    saveUninitialized: false,
}));
app.use(flash());

// Ruteo de API
app.get('/api', (req, res) => {
    res.json({ status: 400, message: "bad request" });
});

app.use('/api/clientes', require('./routes/api/cliente'));
app.use('/api/administrador', require('./routes/api/administrador'));
app.use('/api/ejercicios', require('./routes/api/ejercicio'));
app.use('/api/membresia', require('./routes/api/membresia'));
app.use('/api/membresia2', require('./routes/api/membresia2'));
app.use('/api/pago', require('./routes/api/pago'));
app.use('/api/progreso', require('./routes/api/progreso'));
app.use('/api/rutina', require('./routes/api/rutina'));
app.use('/api/venta', require('./routes/api/venta'));
app.use('/api/asignacion_rutina', require('./routes/api/asignacion_rutina'));

// Ruteo paginas
app.use('/login', require('./routes/login'));
app.use(require('./routes/ruteoVistas'));

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     res.status(300);
//     res.redirect('/');
// });
// VERIFICAR LA FECHA CADA QUE SE REINICIE EN SERVIDOR Y CADA DIA
verificarfecha();
setInterval(() => {
    verificarfecha();
}, 86400000); 
//iniciar servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`)
});