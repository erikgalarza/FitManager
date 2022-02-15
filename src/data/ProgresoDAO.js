const connection = require('./Conexion');


function show(callback){
    const response = {}
    connection.query('SELECT * FROM fk_progreso', (err, result) => {
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
    const stringQuery = 'SELECT * FROM fk_progreso WHERE id_progeso =?';
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
    const { cedula,peso,altura, imc} = data;
    const stringQuery = `INSERT INTO fk_progreso(cedula,peso,altura,imc) VALUES (?,?,?,?)`;
    const query = connection.format(stringQuery, [cedula,peso,altura,imc]);

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

/*function update(data, callback) {
    const response = {};
    const {id,cedula,peso,altura,imc } = data;
    const stringQuery = `UPDATE fk_progreso SET cedula=?,peso=?,altura=?,imc=? WHERE id_progeso=?`;
    const query = connection.format(stringQuery, [cedula,peso,altura,imc,id]);

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
}*/

function remove(id, callback) {   
    const response = {};
    const stringQuery = `DELETE FROM fk_progreso WHERE id_progeso=?`;
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

module.exports = { show, showByID, insert, remove }