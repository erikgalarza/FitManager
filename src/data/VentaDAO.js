const connection = require('./Conexion');


function show(callback) {
    const response = {}
    connection.query('SELECT * FROM fit_venta', (err, result) => {
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
    const stringQuery = "SELECT * FROM fit_venta WHERE id_venta=?";
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
    const {descripcion, valor_cancelado, cantidad} = data;

    const stringQuery = `INSERT INTO fit_venta(descripcion, valor_cancelado, cantidad) VALUES (?,?,?)`;
    const query = connection.format(stringQuery, [descripcion, valor_cancelado, cantidad]);

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
    const {id_venta, descripcion, valor_cancelado, cantidad } = data;

    const stringQuery = `UPDATE fit_venta SET descripcion=?,valor_cancelado=?,cantidad=? WHERE id_venta=?`;

    const query = connection.format(stringQuery, [descripcion, valor_cancelado, cantidad, id_venta]);

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

function remove(id_venta, callback) {   
    const response = {};
    const stringQuery = `DELETE FROM fit_venta WHERE id_venta=?`;
    const query = connection.format(stringQuery, [id_venta]);

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