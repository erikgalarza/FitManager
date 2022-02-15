const {Router} =require('express');
const { showClients, showClientByID, insertClient, updateClient, deleteClient } = require('../../logic/LClienteDAO');
const { validationShow, validationInsert, validationUpdate } = require('../../logic/validator/cliente');


const router = Router();

router.get('/',showClients);
router.get('/:cedula',validationShow,showClientByID);
router.post('/', validationInsert, insertClient);
router.put('/', validationUpdate, updateClient);
router.delete('/:cedula',validationShow, deleteClient);

module.exports=router;