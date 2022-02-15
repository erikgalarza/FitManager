const {Router} =require('express');
const { showAsig, showAsigByID, insertAsig, deleteAsig } = require('../../logic/lAsignarDAO');
const { validationInsert } = require('../../logic/validator/asignar');
const router =Router();

router.get('/', showAsig);
router.get('/:cedula', showAsigByID);
router.post('/',validationInsert, insertAsig);
router.delete('/:cedula/:id_rutina' , deleteAsig);

module.exports=router;
