const { check } = require('express-validator');
const { validateResult } = require('../../helpers/handleGenericFunction');


const validationShow = [

    check('id_pago').exists().not().isEmpty().isInt(),

    (req, res, next) => validateResult(req, res, next)

];

const validationInsert = [
    check('cedula_cliente').exists().withMessage("No se encuentra la nepe2").not().isEmpty()
    .custom((value, {req}) =>{
        if(!validarCedula(value)){
            throw new Error("La cédula no es válida");
        }
        return true;
    }),
    check('valor_cancelado').exists().not().isEmpty().isFloat().escape()
    .custom((value, {req}) =>{
        if((value <= 0 )){
            throw new Error("Ingrese un valor mayor a 0");
        }
        return true;
    }),
   
    (req, res, next) => validateResult(req, res, next)
];

const validationUpdate = [

    check('id_pago').exists(),
    check('cedula_cliente').exists().withMessage("no hay cedula").not().isEmpty()
    .custom((value, {req}) =>{
        if(!validarCedula(value)){
            throw new Error("La cédula no es válida");
        }
        return true;
    }),
    check('valor_cancelado').exists().not().isEmpty().isFloat().escape(),
    (req, res, next) => validateResult(req, res, next)
];


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

module.exports = {validationShow, validationInsert, validationUpdate}