const {Router} =require('express');
const { showAdmins, showAdminByID, insertAdmin, updateAdmin, deleteAdmin } = require('../../logic/lAdministradorDAO');
const { validationShow, validationInsert, validationUpdate } = require('../../logic/validator/administrador');


const router = Router();

router.get('/',showAdmins);
router.get('/:id',validationShow,showAdminByID);
router.post('/', validationInsert, insertAdmin);
router.put('/', validationUpdate, updateAdmin);
router.delete('/:id',validationShow, deleteAdmin);

module.exports=router;