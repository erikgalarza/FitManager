const {Router} =require('express');
const { showMembresias, showMembresiaByID, showMembresiaByCedula,insertMembresia, updateMembresia, deleteMembresia } = require('../../logic/IMembresiaDAO');
const { validationInsert, validationShow2, validationUpdate } = require('../../logic/validator/membresia');
const router = Router();


router.get('/:cedula', validationShow2,showMembresiaByCedula);

module.exports=router;