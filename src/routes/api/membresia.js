const {Router} =require('express');
const { showMembresias, showMembresiaByID, showMembresiaByCedula,insertMembresia, updateMembresia, deleteMembresia } = require('../../logic/IMembresiaDAO');
const { validationInsert, validationShow, validationUpdate } = require('../../logic/validator/membresia');
const router = Router();


router.get('/', showMembresias);
router.get('/:id_membresia',validationShow, showMembresiaByID);
router.post('/', validationInsert, insertMembresia);
router.put('/', validationUpdate, updateMembresia);
router.delete('/:id_membresia', validationShow, deleteMembresia);

module.exports=router;