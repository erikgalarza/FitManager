
const {show,showByID, insert, update, remove } = require('../data/AdministradorDAO');
const { encrypt } = require('../helpers/handleBcrypt');
const { responseJson } = require('../helpers/handleGenericFunction');

function showAdmins(req,res){
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

function showAdminByID(req,res){
    const { id } = req.params;
    showByID(id, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe un administrador con id: ${id}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

async function insertAdmin(req,res){
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
                    res.json(responseJson(403, `El usuario ${data.id} ya está registrado`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

async function updateAdmin(req, res) {
    const data = req.body;
    const passwordHash = await encrypt(data.password);
    data.password = passwordHash;

    update(data, result => {
        if (result.status === 201) {
            if(result.data.affectedRows > 0){
                res.status(201);
                res.json(responseJson(201, "Registro actualizado"));
            }else{
                res.status(403);
                res.json(responseJson(403, "No se actualizó el administrador"));
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

function deleteAdmin(req, res){
    const { id } = req.params;

    remove(id, result => {
        if (result.status === 200) {
            if (result.data.affectedRows > 0) {
                res.status(200);
                res.json(responseJson(200, "registro borrado"))
            } else {
                res.status(403);
                res.json(responseJson(403, `No existe un usuario con ID: ${id}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

module.exports = { showAdmins, showAdminByID, insertAdmin, updateAdmin, deleteAdmin };