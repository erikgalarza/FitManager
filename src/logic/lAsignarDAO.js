const { show, showByCI, insert, remove } = require('../data/AsignarDAO');
const { encrypt } = require('../helpers/handleBcrypt');
const { responseJson } = require('../helpers/handleGenericFunction');

function showAsig(req, res) {
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

function showAsigByID(req, res) {
    const { cedula } = req.params;

    showByCI(cedula, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe  una asignación con CI ${cedula}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

async function insertAsig(req, res) {
    const cedula = req.body;

    insert(cedula, result => {
        if (result.status === 201) {
            res.status(201);
            res.json(responseJson(201, "success"));
        } else {
            switch (result.errno) {
                case 1062:
                    res.status(403);
                    res.json(responseJson(403, `Ehhhhh ${data.cedula} ya está registrada`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}


function deleteAsig(req, res){
    const {cedula, id_rutina} = req.params;
    remove(cedula, id_rutina, result => {
        if (result.status === 200) {
            if (result.data.affectedRows > 0) {
                res.status(200);
                res.json(responseJson(200, "registro borrado"))
            } else {
                res.status(403);
                res.json(responseJson(403, `No existe una asignación con CI: `));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}



module.exports = {showAsig, showAsigByID, insertAsig, deleteAsig };