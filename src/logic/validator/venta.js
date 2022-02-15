const { check } = require('express-validator');
const { validateResult } = require('../../helpers/handleGenericFunction');


const validationInsert = [
    check('descripcion').exists().not().isEmpty().trim().escape(),
    check('valor_cancelado').exists().not().isEmpty().isNumeric(),
    check('cantidad').exists().not().isEmpty().isNumeric().isInt(),
    (req, res, next) => validateResult(req, res, next)
];

const validationUpdate = [
    check('id_venta').exists().not().isEmpty().isInt(),
    check('descripcion').exists().not().isEmpty().trim().escape(),
    check('valor_cancelado').exists().not().isEmpty().isNumeric(),
    check('cantidad').exists().not().isEmpty().isNumeric().isInt(),
    (req, res, next) => validateResult(req, res, next)
];

const validationShow = [
    check('id_venta').exists().not().isEmpty().isInt(),
    (req, res, next) => validateResult(req, res, next)
];

module.exports = {validationShow, validationInsert,validationUpdate}