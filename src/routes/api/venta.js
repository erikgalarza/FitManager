const {Router} =require('express');
const {  showVentas, showVentasByID, insertVenta, updateVenta, deleteVenta } = require('../../logic/IVentaDAO');
const { validationShow, validationInsert,validationUpdate } = require('../../logic/validator/venta');
const router = Router();


router.get('/', showVentas);
router.get('/:id_venta',validationShow, showVentasByID);
router.post('/', validationInsert, insertVenta);
router.put('/', validationUpdate, updateVenta);
router.delete('/:id_venta', validationShow, deleteVenta);

module.exports=router;