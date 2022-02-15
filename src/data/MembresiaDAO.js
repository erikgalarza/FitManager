const connection = require('./Conexion');


function show(callback) {
    const response = {}
    connection.query('SELECT * FROM ft_membresia', (err, result) => {
        if (err) {
            response.status = 500;
            response.data = `${err.sqlState} - ${err.sqlMessage}`;
        } else {
            response.status = 200;
            response.data = result;
        }
        callback(response);
    });
}

function showByID(id_membresia, callback) {
    const response = {}
    const stringQuery = "SELECT * FROM ft_membresia WHERE id_membresia=?";
    const query = connection.format(stringQuery, [id_membresia]);

    connection.query(query, (err, result) => {
        if (err) {
            response.status = 500;
            response.data = `${err.sqlState} - ${err.sqlMessage}`;
        } else {
            response.status = 200;
            response.data = result;
        }
        callback(response);
    });
}
function showByCedula(cedula, callback) {
    const response = {}
    const stringQuery = "SELECT * FROM ft_membresia WHERE cedula=?";
    const query = connection.format(stringQuery, [cedula]);
    connection.query(query, (err, result) => {
        if (err) {
            response.status = 500;
            response.data = `${err.sqlState} - ${err.sqlMessage}`;
        } else {
            response.status = 200;
            response.data = result;
        }
        callback(response);
    });
}
function insert(data, callback) {
    const response = {};
    const {cedula, fecha_fin, estado, notificado} = data;

    const stringQuery = `INSERT INTO ft_membresia(cedula, fecha_fin, estado, notificado) VALUES (?,?,?,?)`;
    const query = connection.format(stringQuery, [cedula, fecha_fin, estado, notificado]);

    connection.query(query, (err, result) => {
        if (err) {
            response.status = 500;
            response.errno = err.errno,
                response.data = `${err.sqlState} - ${err.sqlMessage}`;
        } else {
            response.status = 201;
            response.data = result;
        }
        callback(response);
    });
}

function update(data, callback) {
    const response = {};
    const {id_membresia, cedula, fecha_fin, estado, notificado} = data;

    const stringQuery = `UPDATE ft_membresia SET cedula=?,fecha_fin=?,estado=?,notificado=? WHERE id_membresia=?`;

    const query = connection.format(stringQuery, [cedula, fecha_fin, estado, notificado, id_membresia]);

    connection.query(query, (err, result) => {
        if (err) {
            response.status = 500;
            response.errno = err.errno,
                response.data = `${err.sqlState} - ${err.sqlMessage}`;
        } else {
            response.status = 201;
            response.data = result;
        }
        callback(response);
    });
}

function remove(id_membresia, callback) {   
    const response = {};
    const stringQuery = `DELETE FROM ft_membresia WHERE id_membresia=?`;
    const query = connection.format(stringQuery, [id_membresia]);

    connection.query(query, (err, result)=>{
        if (err) {
            response.status = 500;
            response.data = `${err.sqlState} - ${err.sqlMessage}`;
        } else {
            response.status = 200;
            response.data = result;
        }
        callback(response);
    });
}

module.exports = { show, showByID, showByCedula,insert, update, remove }