const {Router} =require('express');
const { showExercises, showExerciseByID, insertExercise, updateExercise, deleteExercise } = require('../../logic/lEjercicioDAO');
const { validationInsert, validationShow, validationUpdate } = require('../../logic/validator/ejecicio');
const router = Router();


router.get('/', showExercises);
router.get('/:id',validationShow, showExerciseByID);
router.post('/', validationInsert, insertExercise);
router.put('/', validationUpdate, updateExercise);
router.delete('/:id', validationShow, deleteExercise);

module.exports=router;