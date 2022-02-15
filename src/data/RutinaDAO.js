const connection = require('./Conexion');

function show(callback) {
    const response = {}
    connection.query('SELECT * FROM ft_rutina', (err, result) => {
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
    const stringQuery = "SELECT * FROM ft_rutina WHERE id_rutina=?";
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
    const stringQuery = `INSERT INTO ft_rutina (nombre, ejercicios) VALUES (?, ?)`;
    const query = connection.format(stringQuery, [data.nombre, data.ejercicios]);
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
    const { id, ejercicios, nombre } = data;

    const stringQuery = `UPDATE ft_rutina SET nombre=?, ejercicios=? WHERE id_rutina=?`;
    const query = connection.format(stringQuery, [nombre, ejercicios, id]);

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
    const stringQuery = `DELETE FROM ft_rutina WHERE id_rutina=?`;
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

module.exports = { show, showByID, insert, update, remove }