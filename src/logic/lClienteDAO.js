const { show, showByCI, insert, update, remove } = require('../data/ClienteDAO');
const { encrypt } = require('../helpers/handleBcrypt');
const { responseJson } = require('../helpers/handleGenericFunction');

function showClients(req, res) {
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

function showClientByID(req, res) {
    const { cedula } = req.params;

    showByCI(cedula, result => {
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

async function insertClient(req, res) {
    const data = req.body;
    const passwordHash = await encrypt(data.password);
    data.password = passwordHash;

    insert(data, result => {
        if (result.status === 201) {
            res.status(201);
            res.json(responseJson(201, "success"));
        } else {
            switch (result.errno) {
                case 1062:
                    res.status(403);
                    res.json(responseJson(403, `El usuario ${data.cedula} ya está registrado`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

async function updateClient(req, res) {
    const data = req.body;

    if(data.password.length != 0){
        const passwordHash = await encrypt(data.password);
        data.password = passwordHash;
    }else{
        data.password = data.oldPassword;
    }

    update(data, result => {
        if (result.status === 201) {
            if(result.data.affectedRows > 0){
                res.status(201);
                res.json(responseJson(201, "registro actualizado"));
            }else{
                res.status(403);
                res.json(responseJson(403, "No se actualizo el usuario"));
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

function deleteClient(req, res){
    const { cedula } = req.params;

    remove(cedula, result => {
        if (result.status === 200) {
            if (result.data.affectedRows > 0) {
                res.status(200);
                res.json(responseJson(200, "registro borrado"))
            } else {
                res.status(403);
                res.json(responseJson(403, `No existe un usuario con CI: ${cedula}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}



module.exports = { showClients, showClientByID, insertClient, updateClient, deleteClient };