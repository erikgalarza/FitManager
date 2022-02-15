const { check } = require('express-validator');
const { validateResult } = require('../../helpers/handleGenericFunction');


const validationInsert = [
    check('cedula').exists().withMessage("No hay cedula").not().isEmpty()
    .custom((value, {req}) =>{
        if(!validarCedula(value)){
            throw new Error("La cédula no es válida");
        }
        return true;
    }),
    check('id_rutina').exists().not().isEmpty().isInt().escape(),
    check('dia_asginado').exists(),
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

/* -------------------------------------------------------------------------- */
/*                           Exportacion de modulos                           */
/* -------------------------------------------------------------------------- */

module.exports = { validationInsert}