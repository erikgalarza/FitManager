const {Router} =require('express');
const { showPago,showPagoByID, insertPago, updatePago, deletePago} = require('../../logic/lPagoDAO');
const { validationShow, validationInsert, validationUpdate } = require('../../logic/validator/pago');
const router = Router();

router.get('/', showPago);
router.get('/:id_pago', validationShow, showPagoByID);
router.post('/',validationInsert, insertPago);
router.put('/', validationUpdate,  updatePago);
router.delete('/:id_pago',validationShow, deletePago);

module.exports=router;