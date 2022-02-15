const connection = require('./Conexion');


function show(callback) {
    const response = {}
    connection.query('SELECT * FROM ft_asignacion_rutina', (err, result) => {
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
    const stringQuery = "SELECT *  FROM ft_asignacion_rutina WHERE cedula=?";
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
    const { cedula, id_rutina, dia_asginado } = data;

    const stringQuery = `INSERT INTO ft_asignacion_rutina(cedula, id_rutina, dia_asginado) VALUES (?,?,?)`;
    
    const query = connection.format(stringQuery, [cedula, id_rutina, dia_asginado]);

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


function remove(cedula, id_rutina, callback) {   
    const response = {};
    const stringQuery = `DELETE FROM ft_asignacion_rutina WHERE cedula=? and id_rutina=?`;
    const query = connection.format(stringQuery, [cedula, id_rutina]);

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

module.exports = { show, showByCI, insert, remove }