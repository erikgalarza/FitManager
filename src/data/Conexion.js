const mysql = require('mysql');

// Coloca aquí tus credenciales
const connection = mysql.createConnection({
    host: "mysql-angelojz7.alwaysdata.net",
    database: "angelojz7_manage_fit",
    user: "angelojz7",
    password: "fitmanager65656566",
    charset: "utf8mb4"
});

connection.connect((err) =>{
    if(err) throw err;
    console.log("Conexion con mysql realizada con exito");
})

module.exports = connection;