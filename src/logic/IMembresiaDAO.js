const { show, showByID, showByCedula,insert, update, remove} = require('../data/MembresiaDAO');
const {showByCI} = require('../data/ClienteDAO');
const { responseJson } = require('../helpers/handleGenericFunction');
var nodemailer = require('nodemailer');

function showMembresias(req, res) {
    show(result => {
        if (result.status === 200) {
            res.status(200);
            res.json(responseJson(200, "success", result.data));
        } else {
            res.status(result.status);
            res.json(responseJsonnseJson(result.status, result.data));
        }
    })
}

function showMembresiaByID(req, res) {
    const { id_membresia } = req.params;

    showByID(id_membresia, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe un usuario con ID: ${id_membresia}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}
function showMembresiaByCedula(req, res) {
    const { cedula } = req.params;
    showByCedula(cedula, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe un usuario con CI: ${cedula}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

 async function insertMembresia(req, res) {
    const data = req.body;
    data.estado=1;
    insert(data, result => {
        if (result.status === 201) {
            res.json(responseJson(201, "success"));
        } else {
            switch (result.errno) {
                case 1062:
                    res.status(403);
                    res.json(responseJson(403, `La membresia ${data.id_membresia} ya está registrado`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

 function updateMembresia(req, res) {
    const data = req.body;

    update(data, result => {
        if (result.status === 201) {
            if(result.data.affectedRows > 0){
                res.status(201);
                res.json(responseJson(201, "registro actualizado"));
            }else{
                res.status(403);
                res.json(responseJson(403, "No se actualizo la membresia"));
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

function deleteMembresia(req, res){
    const { id_membresia } = req.params;
    
    remove(id_membresia, result => {
        if (result.status === 200) {
            if (result.data.affectedRows > 0) {
                res.status(200);
                res.json(responseJson(200, "registro borrado"))
            } else {
                res.status(403);
                res.json(responseJson(403, `No existe una membresia con ID: ${id_membresia}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

 function verificarfecha(){
    show(result => {
        let hoy =  new Date().toISOString().slice(0, 10);
        let hoy2 =  new Date().getUTCHours();
        let aux=Date.parse(hoy);
        if((hoy2>=0)&&(hoy2<5)){
            aux=aux-86400000;
        }
        console.log("Verificando membresias...");
        for (var i = 0; i < result.data.length; i++) {
            var x=result.data[i].fecha_fin;
            var fecha_fin=x.toISOString().slice(0, 10);
            var aux1=Date.parse(fecha_fin);
            if(aux==(aux1-86400000)){
                const data = result.data[i];
                if(data.notificado==0){
                    console.log(data.notificado);
                        data.notificado=1;
                        update(data, result1 => {
                        if (result1.status == 201) {
                            showByCI(data.cedula, result1=> {
                            enviarnotificacion(result1.data[0]);
                            }); 
                            if(result1.data.affectedRows > 0){
                            }else{
                            res.status(403);
                            res.json(responseJson(403, "No se actualizo la membresia"));
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
            }
            if(aux==aux1){
                const data = result.data[i];
                if(data.estado==1){
                        data.estado=0;
                        update(data, result1 => {
                        if (result1.status === 201) {
                            if(result1.data.affectedRows > 0){
                            }else{
                            res.status(403);
                            res.json(responseJson(403, "No se actualizo la membresia"));
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
            }
            if(aux<aux1){
                const data = result.data[i];
                if(data.estado==0){
                        data.estado=1;
                        update(data, result1 => {
                        if (result1.status === 201) {
                            if(result1.data.affectedRows > 0){
                            }else{
                            res.status(403);
                            res.json(responseJson(403, "No se actualizo la membresia"));
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
            }
         }
        
    })
}
async function enviarnotificacion(data){
    var correo= "'<"+data.correo+">'";
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'chimboemily@gmail.com',
          pass: 'fhlheretbkabkodh'
        }
      });
      transporter.verify().then(()=>{
        console.log("correo funcionando");
      });
      try{
        await transporter.sendMail({
            from: '<chimboemily@gmail.com>',
            to: correo,
            subject:'Membresia de Gym a punto de expirar',
            html: `<h1>Cuidado! Tu membresía del gym caduca el día de mañana... </h1>
            <img src="https://www.skymsen.com/uploads/blog/Cuidados-con-los-aceros-inoxidables.png" height="50px"> 
            <p>Actualiza tu pago para poder continuar utilizando nuestros servicios</p> `
        });
        }
    catch(error){
        res.json(responseJson(500, `Hubo un error de correo`));
}
}



module.exports = { verificarfecha,showMembresias, showMembresiaByID, showMembresiaByCedula,insertMembresia, updateMembresia, deleteMembresia };