const connection = require('./Conexion');

function show(callback) {
    const response = {}
    connection.query('SELECT * FROM fit_pago', (err, result) => {
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

function showByID(data, callback) {
    const response = {}
    const stringQuery = "SELECT * FROM fit_pago WHERE id_pago=?";
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
    const {cedula_cliente,valor_cancelado,id_membresia, fecha_pago} = data;
    const stringQuery = `INSERT INTO fit_pago(cedula_cliente, valor_cancelado, id_membresia, fecha_pago) VALUES (?,?,?,?)`;
    const query = connection.format(stringQuery, [cedula_cliente,valor_cancelado,id_membresia, fecha_pago]);
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
    const {cedula_cliente,valor_cancelado,id_membresia, fecha_pago,id_pago} = data;

    const stringQuery = `UPDATE fit_pago SET cedula_cliente=?,valor_cancelado=?,id_membresia=?,fecha_pago=? WHERE id_pago=?`;
    const query = connection.format(stringQuery, [cedula_cliente,valor_cancelado,id_membresia, fecha_pago,id_pago]);

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

function remove(id_pago, callback) {   
    const response = {};
    const stringQuery = `DELETE FROM fit_pago WHERE id_pago=?`;
    const query = connection.format(stringQuery, [id_pago]);

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

module.exports = { show, showByID, insert, update, remove }