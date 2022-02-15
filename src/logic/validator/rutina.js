const { check } = require('express-validator');
const { validateResult } = require('../../helpers/handleGenericFunction');

const validationShow = [
    check('id').exists().not().isEmpty().isInt(),
    (req, res, next) => validateResult(req, res, next)
];

const validationInsert = [
    check('ejercicios').exists().not().isEmpty(),
    (req, res, next) => validateResult(req, res, next)
];

const validationUpdate = [
    check('id').exists().not().isEmpty().isInt(),
    check('ejercicios').exists().withMessage("No se encuentran los ejercicios").not().isEmpty(),

    (req, res, next) => validateResult(req, res, next)
];

module.exports = {validationShow, validationInsert, validationUpdate}