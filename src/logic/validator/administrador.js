const { check } = require("express-validator");
const { validateResult } = require('../../helpers/handleGenericFunction');

const validationInsert = [
    check('nombres').not().isEmpty().withMessage('No puede ser vacios').trim().escape(),
    check('correo').exists().isEmail(),
    check('password').exists().not().isEmpty().isLength({ min: 4, max: 12 }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

const validationUpdate = [
    check('id').exists().not().isEmpty().isInt(),
    check('nombres').not().isEmpty().withMessage('No puede ser vacio').trim().escape(),
    check('correo').exists().isEmail(),
    check('password').exists().not().isEmpty().isLength({ min: 4, max: 12 }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

const validationShow = [
    check('id').exists().not().isEmpty().isInt(),
    (req, res, next) => validateResult(req, res, next)
];

module.exports = {  validationShow, validationInsert, validationUpdate }