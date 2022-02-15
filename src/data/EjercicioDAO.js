const connection = require('./Conexion');


function show(callback) {
    const response = {}
    connection.query('SELECT * FROM fit_ejercicios', (err, result) => {
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

function showByCI(id, callback) {
    const response = {}
    const stringQuery = "SELECT * FROM fit_ejercicios WHERE id_ejercicios=?";
    const query = connection.format(stringQuery, [id]);

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
    const {nombre, descripcion, imagen } = data;

    const stringQuery = `INSERT INTO fit_ejercicios(nombre, descripcion, imagen) VALUES (?,?,?)`;
    const query = connection.format(stringQuery, [nombre,descripcion,imagen]);

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
    const {id, nombre, descripcion, imagen } = data;

    const stringQuery = `UPDATE fit_ejercicios SET nombre=?,descripcion=?,imagen=? WHERE id_ejercicios=?`;

    const query = connection.format(stringQuery, [nombre, descripcion, imagen, id]);

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

function remove(cedula, callback) {   
    const response = {};
    const stringQuery = `DELETE FROM fit_ejercicios WHERE id_ejercicios=?`;
    const query = connection.format(stringQuery, [cedula]);

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

module.exports = { show, showByCI, insert, update, remove }