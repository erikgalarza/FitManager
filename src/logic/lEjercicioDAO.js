const { show, showByCI, insert, update, remove } = require('../data/EjercicioDAO');
const { responseJson } = require('../helpers/handleGenericFunction');

function showExercises(req, res) {
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

function showExerciseByID(req, res) {
    const { id } = req.params;

    showByCI(id, result => {
        if (result.status === 200) {
            if (result.data.length != 0) {
                res.status(200);
                res.json(responseJson(200, "success", result.data))
            } else {
                res.status(404);
                res.json(responseJson(404, `No existe ejercicio con ID: ${id}`));
            }
        } else {
            res.status(result.status);
            res.json(responseJson(result.status, result.data));
        }
    })
}

function insertExercise(req, res) {
    const data = req.body;

    insert(data, result => {
        if (result.status === 201) {
            res.status(201);
            res.json(responseJson(201, "success"));
        } else {
            switch (result.errno) {
                case 1062:
                    res.status(403);
                    res.json(responseJson(403, `El ejercicio ${data.id} ya está registrado`));
                    break;
                default:
                    res.status(500);
                    res.json(responseJson(500, result.data));
                    break;
            }
        }
    });
}

function updateExercise(req, res) {
    const data = req.body;
    
    update(data, result => {
        if (result.status === 201) {
            if(result.data.affectedRows > 0){
                res.status(201);
                res.json(responseJson(201, "registro actualizado"));
            }else{
                res.status(403);
                res.json(responseJson(403, "No se actualizo el ejercicio"));
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

function deleteExercise(req, res){
    const { id } = req.params;

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



module.exports = { showExercises, showExerciseByID, insertExercise, updateExercise, deleteExercise };