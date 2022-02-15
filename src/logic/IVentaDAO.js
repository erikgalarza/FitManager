const { show, showByID, insert, update, remove } = require('../data/VentaDAO');
const { encrypt } = require('../helpers/handleBcrypt');
const { responseJson } = require('../helpers/handleGenericFunction');

function showVentas(req, res) {
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

function showVentasByID(req, res) {
    const { id_venta } = req.params;

    showByID(id_venta, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe una venta con ID: ${id_venta}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

async function insertVenta(req, res) {
    const data = req.body;

    insert(data, result => {
        if (result.status === 201) {
            res.status(201);
            res.json(responseJson(201, "success"));
        } else {
            switch (result.errno) {
                case 1062:
                    res.status(403);
                    res.json(responseJson(403, `La venta ${data.id_venta} ya está registrada`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

function updateVenta(req, res) {
    const data = req.body;



    update(data, result => {
        if (result.status === 201) {
            if(result.data.affectedRows > 0){
                res.status(201);
                res.json(responseJson(201, "registro actualizado"));
            }else{
                res.status(403);
                res.json(responseJson(403, "No se actualizo la venta"));
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

function deleteVenta(req, res){
    const { id_venta } = req.params;

    remove(id_venta, result => {
        if (result.status === 200) {
            if (result.data.affectedRows > 0) {
                res.status(200);
                res.json(responseJson(200, "registro borrado"))
            } else {
                res.status(403);
                res.json(responseJson(403, `No existe ventaa con ID: ${id_venta}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}



module.exports = { showVentas, showVentasByID, insertVenta, updateVenta, deleteVenta };