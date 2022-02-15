const { check } = require('express-validator');
const { validateResult } = require('../../helpers/handleGenericFunction');

const validationInsert = [
    check('nombre').exists().not().isEmpty().trim().escape(),
    check('descripcion').exists().not().isEmpty().trim().escape(),
    check('imagen').exists().not().isEmpty().trim(),
    (req, res, next) => validateResult(req, res, next)
];

const validationUpdate = [
    check('id').exists().not().isEmpty().isNumeric().isInt(),
    check('nombre').exists().not().isEmpty().trim().escape(),
    check('descripcion').exists().not().isEmpty().trim().escape(),
    check('imagen').exists().not().isEmpty().trim(),
    (req, res, next) => validateResult(req, res, next)
];

const validationShow = [
    check('id').exists().not().isEmpty().isInt(),
    (req, res, next) => validateResult(req, res, next)
];

module.exports = {validationShow, validationInsert, validationUpdate}