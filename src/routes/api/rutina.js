const {Router} =require('express');
const { showRutine, showRutineByID, insertRutine, updateRutine, deleteRutine } = require('../../logic/lRutinaDAO');
const { validationShow, validationInsert, validationUpdate } = require('../../logic/validator/rutina');
const router =Router();

router.get('/', showRutine);
router.get('/:id', validationShow, showRutineByID);
router.post('/',validationInsert, insertRutine);
router.put('/', validationUpdate,  updateRutine);
router.delete('/:id',validationShow, deleteRutine);

module.exports=router;
