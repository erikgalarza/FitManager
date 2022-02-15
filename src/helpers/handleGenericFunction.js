const { validationResult } = require('express-validator');


const responseJson = (status, message, data = null) => {
    const res = {
        status,
        message,
    }
    if (data) res.data = data;
    return res;
}


const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw();
        return next();
    } catch (err) {
        res.status(400);
        res.json({ 
            status: 400,
            message: "argumentos invalidos",
            errors: err.array() 
        })
    }
}

module.exports = {responseJson, validateResult}