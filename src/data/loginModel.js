const connection = require('./Conexion');

function getClientByEmail(email) {
    const response = {}
    const stringQuery = "SELECT cedula, nombres, correo, password FROM fit_cliente WHERE correo=?";
    const query = connection.format(stringQuery, [email]);

    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) {
                response.status = 500;
                response.data = `${err.sqlState} - ${err.sqlMessage}`;
                reject(response);
            } else {
                response.status = 200;
                response.data = result;
                resolve(response);
            }
        })
    });

}
function getAdminByEmail(email) {
    const response = {}
    const stringQuery = "SELECT * FROM fit_administrador WHERE correo=?";
    const query = connection.format(stringQuery, [email]);

    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) {
                response.status = 500;
                response.data = `${err.sqlState} - ${err.sqlMessage}`;
                reject(response);
            } else {
                response.status = 200;
                response.data = result;
                resolve(response);
            }
        })
    });
}

module.exports = {getClientByEmail, getAdminByEmail}