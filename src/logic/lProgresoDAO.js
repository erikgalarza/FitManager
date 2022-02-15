const { show, showByID, insert, remove } = require('../data/ProgresoDAO');
const { responseJson } = require('../helpers/handleGenericFunction');

function showProgreso(req, res) {
    show(result => {
        if (result.status === 200) {
            res.status(200);
            res.json(responseJson(200, "success", result.data));
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

function showProgresoByID(req, res) {
    const { id } = req.params;

    showByID(id, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe Progreso con ID: ${id}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

function insertProgreso(req, res) {
    const data = req.body;
    data.imc = (data.peso / Math.pow(data.altura, 2));
    insert(data, result => {
        if (result.status === 201) {
            res.status(201);
            res.json(responseJson(201, "success"));
        } else {
            switch (result.errno) {
                case 1062:
                    res.status(403);
                    res.json(responseJson(403, `El progreso con id: ${data.id} ya está registrado`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

//function updateProgreso(req, res) {
//    const data = req.body;
//    data.imc = (data.peso / Math.pow(data.altura, 2));

//    update(data, result => {
//        if (result.status === 201) {
//            if(result.data.affectedRows > 0){
//                res.status(201);
//                res.json(responseJson(201, "registro actualizado"));
//            }else{
//                res.status(403);
//                res.json(responseJson(403, "No se actualizo el progreso de: ${data.cedula}"));
//            }
//        } else {
//            switch (result.errno) {
//                default:
//                    res.status(500);
//                    res.json(responseJson(500, result.data));
//                    break;
//            }
//        }
//    });
//}

function deleteProgreso(req, res){
    const {id}  = req.params;

    remove(id, result => {
        if (result.status === 200) {
            if (result.data.affectedRows > 0) {
                res.status(200);
                res.json(responseJson(200, "registro borrado"))
            } else {
                res.status(403);
                res.json(responseJson(403, `No existe ejercicio con ID: ${id}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}



module.exports = { showProgreso, showProgresoByID, insertProgreso, deleteProgreso };