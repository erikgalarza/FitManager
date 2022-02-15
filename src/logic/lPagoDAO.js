const { show, showByID, insert, update, remove } = require('../data/PagoDAO');
const { responseJson } = require('../helpers/handleGenericFunction');
const {showByCI} = require('../data/ClienteDAO');
var nodemailer = require('nodemailer');



function showPago(req, res) {
    show(result => {
        if (result.status === 200) {
            res.status(200);
            res.json(responseJson(200, "Success", result.data));
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

function showPagoByID(req, res) {
    const { id_pago } = req.params;

    showByID(id_pago, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "Success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe un Pago con ID: ${id_pago}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

function insertPago(req, res) {
    const data = req.body;

    insert(data, result => {
        if (result.status === 201) {
            showByCI(data.cedula_cliente, result1=> {
                renovacion(result1.data[0],data.fecha_fin);
    
                 });
            res.status(201);
            res.json(responseJson(201, "Success"));
        } else {
            switch (result.errno) {
                case 1062:
                    res.status(403);
                    res.json(responseJson(403, `El pago ${data.id_pago} ya está registrado`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

function updatePago(req, res) {
    const data = req.body;



    update(data, result => {
        if (result.status === 201) {
            if(result.data.affectedRows > 0){
                res.status(201);
                res.json(responseJson(201, "Registro actualizado"));
            }else{
                res.status(403);
                res.json(responseJson(403, "No se actualizo el pago"));
            }
        } else {
            switch (result.errno) {
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

function deletePago(req, res){
    const { id_pago } = req.params;

    remove(id_pago, result => {
        if (result.status === 200) {
            if (result.data.affectedRows > 0) {
                res.status(200);
                res.json(responseJson(200, "Registro borrado"))
            } else {
                res.status(403);
                res.json(responseJson(403, `No existe ningun pago con ID: ${id_pago}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

async function renovacion(data,fecha){
    var correo= "'<"+data.correo+">'";
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'erikerikerik.eg@gmail.com',
          pass: 'hugcgcuruagfdnir'
        }
      });
      transporter.verify().then(()=>{
        console.log("Correo Funcionando");
      });
      
    try{
        await transporter.sendMail({
            from: '<erikerikerik.eg@gmail.com>',
            to: correo,
            subject:'Su Membresia ha sido Actualizada',
            html: `<h1>Felicidades! Tu membresía del gym a sido renovada... </h1> 
            <h2>Tu pago ha sido realizado con éxito, disfruta de nuestros servicios</h2>
            <h3>Att:Tu gym favorito</h3>
            <img src="https://img.freepik.com/foto-gratis/hombre-fuerte-entrenando-gimnasio_1303-23478.jpg?size=626&ext=jpg" height="400px">
            `
        });
        }
    catch(error){
        console.log("PROBLEMA DEL CORREO");
    }
}

module.exports = {showPago, showPagoByID, insertPago, updatePago, deletePago};