const { check } = require('express-validator');
const { validateResult } = require('../../helpers/handleGenericFunction');


const validationInsert = [
   check('cedula').exists().withMessage("no hay cedula").not().isEmpty()
    .custom((value, {req}) =>{
        if(!validarCedula(value)){
            throw new Error("La cédula no es válida");
        }
        return true;
    }),
    check('fecha_fin').exists().not().isEmpty().isDate(),
    check('estado').not().isEmpty().isLength({ min: 1, max: 4 }),
    check('notificado').exists().not().isEmpty().isLength({ min: 1, max: 1 }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];

const validationUpdate = [
    check('id_membresia').exists(),
    check('cedula').exists().withMessage("no hay cedula").not().isEmpty()
    .custom((value, {req}) =>{
        if(!validarCedula(value)){
            throw new Error("La cédula no es válida");
        }
        return true;
    }),
    check('fecha_fin').exists().not().isEmpty().isDate(),
    check('estado').not().isEmpty().isLength({ min: 1, max: 4 }).isNumeric(),
    check('notificado').exists().not().isEmpty().isLength({ min: 1, max: 1 }).isNumeric(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];


/* -------------------------------------------------------------------------- */
/*                  funciones de validaciones personalizadas                  */
/* -------------------------------------------------------------------------- */
function validarCedula(cedula) {
    if (cedula.length != 10) return false;

    cedula = cedula.split('');
    const verificadorCI = Number.parseInt(cedula[cedula.length - 1]);
    let sumatoria = 0;
    for (let i = 0; i < cedula.length - 1; i++) {
        let element = Number.parseInt(cedula[i]);
        if (i % 2 == 0) {
            let aux = element * 2;
            element = (aux >= 10) ? (aux - 9) : aux;
        }
        sumatoria += element;
    }
    const verificadorCalc = calcularDecena(sumatoria) - sumatoria;
    return verificadorCI === verificadorCalc;
}

function calcularDecena(decena) {
    let calcular;
    calcular = decena - (decena % 10) + 10;
    return calcular;
}

const validationShow = [
    check('id_membresia').exists().not().isEmpty().isInt(),
    (req, res, next) => validateResult(req, res, next)
];

const validationShow2 = [
    check('cedula').exists().not().isEmpty()
    .custom((value, {req}) =>{
        if(!validarCedula(value)){
            throw new Error("La cédula no es válida");
        }
        return true;
    }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
];
/* -------------------------------------------------------------------------- */
/*                           Exportacion de modulos                           */
/* -------------------------------------------------------------------------- */

module.exports = {validationShow, validationShow2,validationInsert, validationUpdate }