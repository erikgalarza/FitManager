const {Router} =require('express');
const { showProgreso, showProgresoByID, insertProgreso, updateProgreso, deleteProgreso } = require('../../logic/lProgresoDAO');
const { validationShow, validationInsert, validationUpdate } = require('../../logic/validator/progreso');


const router = Router();

router.get('/',showProgreso);
router.get('/:id',validationShow,showProgresoByID);
router.post('/', validationInsert, insertProgreso);
//router.put('/', validationUpdate, updateProgreso);
router.delete('/:id',validationShow, deleteProgreso);

module.exports=router;