const { check } = require('express-validator');
const { validateResult } = require('../../helpers/handleGenericFunction');

const validationShow = [
    check('id').exists().not().isEmpty().isInt(),
    (req, res, next) => validateResult(req, res, next)
];

const validationInsert = [
    check('cedula').exists().withMessage("no hay cedula").not().isEmpty()
    .custom((value, {req}) =>{
        if(!validarCedula(value)){
            throw new Error("La cédula no es válida");
        }
        return true;
    }),
    check('peso').exists().not().isEmpty().isFloat()
    .custom((value, {req}) =>{
        if(!calcularPeso(value)){
            throw new Error("El peso no es válido");
        }
        return true;
    }),
    check('altura').exists().not().isEmpty().isFloat()
    .custom((value, {req}) =>{
        if(!calcularAltura(value)){
            throw new Error("La altura no es válida");
        }
        return true;
    }),
    (req, res, next) => validateResult(req, res, next)
];

/*const validationUpdate = [
    check('id').exists().not().isEmpty().isNumeric().isInt(),
    check('peso').exists().not().isEmpty().isFloat()
    .custom((value, {req}) =>{
        if(!calcularPeso(value)){
            throw new Error("El peso no es válido");
        }
        return true;
    }),
    check('altura').exists().not().isEmpty().isFloat()
    .custom((value, {req}) =>{
        if(!calcularAltura(value)){
            throw new Error("La altura no es válida");
        }
        return true;
    }),
    (req, res, next) => validateResult(req, res, next)
];*/



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

function calcularPeso(peso){
    if (peso>=5 && peso<=150 ){
        return peso
    }   
};

function calcularAltura(altura){
    if ( altura>=0.5 && altura<=3){
        return altura
    }
}

module.exports = {  validationShow, validationInsert}