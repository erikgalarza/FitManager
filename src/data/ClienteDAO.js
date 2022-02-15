const connection = require('./Conexion');


function show(callback) {
    const response = {}
    connection.query('SELECT * FROM fit_cliente', (err, result) => {
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

function showByCI(data, callback) {
    const response = {}
    const stringQuery = "SELECT * FROM fit_cliente WHERE cedula=?";
    const query = connection.format(stringQuery, [data]);

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
    const { cedula, nombres, correo, password, impedimentos } = data;

    const stringQuery = `INSERT INTO fit_cliente(cedula, nombres, correo, password, impedimentos) VALUES (?,?,?,?,?)`;
    
    const query = connection.format(stringQuery, [cedula, nombres, correo, password, impedimentos]);

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
    const { cedula, nombres, correo, password, impedimentos } = data;

    const stringQuery = `UPDATE fit_cliente SET nombres=?,correo=?,password=?,impedimentos=? WHERE cedula=?`;
    const query = connection.format(stringQuery, [nombres, correo, password, impedimentos, cedula]);

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
    const stringQuery = `DELETE FROM fit_cliente WHERE cedula=?`;
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