const connection = require('./Conexion');

function show(callback){
    const response = {}
    connection.query('SELECT * FROM fit_administrador', (err, result) => {
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
    const stringQuery = "SELECT * FROM fit_administrador WHERE id_administrador=?";
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
    const { nombres, correo, password} = data;

    const stringQuery = `INSERT INTO fit_administrador(nombres, correo, password) VALUES (?,?,?)`;
    const query = connection.format(stringQuery, [nombres,correo,password]);

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
    const {id,nombres, correo, password} = data;

    const stringQuery = `UPDATE fit_administrador SET nombres=?,correo=?,password=? WHERE id_administrador=?`;
    const query = connection.format(stringQuery, [nombres,correo,password,id]);

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
function remove(id, callback) {   
    const response = {};
    const stringQuery = `DELETE FROM fit_administrador WHERE id_administrador=?`;
    const query = connection.format(stringQuery, [id]);

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