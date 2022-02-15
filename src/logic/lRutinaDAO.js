const { show, showByID, insert, update, remove } = require('../data/RutinaDAO');
const { responseJson } = require('../helpers/handleGenericFunction');


function showRutine(req, res) {
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

function showRutineByID(req, res) {
    const { id } = req.params;

    showByID(id, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "Success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe una rutina con ID: ${id}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

function insertRutine(req, res) {
    const data = req.body;;
    insert(data, result => {
        if (result.status === 201) {
            res.status(201);
            res.json(responseJson(201, "Success"));
        } else {
            switch (result.errno) {
                case 1062:
                    res.status(403);
                    res.json(responseJson(403, `La rutina ${data.id} ya está registrada`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

function updateRutine(req, res) {
    const data = req.body;

    update(data, result => {
        if (result.status === 201) {
            if(result.data.affectedRows > 0){
                res.status(201);
                res.json(responseJson(201, "Registro actualizado"));
            }else{
                res.status(403);
                res.json(responseJson(403, "No se actualizo la rutina"));
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

function deleteRutine(req, res){
    const { id } = req.params;

    remove(id, result => {
        if (result.status === 200) {
            if (result.data.affectedRows > 0) {
                res.status(200);
                res.json(responseJson(200, "Registro borrado"))
            } else {
                res.status(403);
                res.json(responseJson(403, `No existe ninguna rutina con ID: ${id}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

module.exports = {showRutine, showRutineByID, insertRutine, updateRutine, deleteRutine};
