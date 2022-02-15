const bcrypt = require('bcrypt');

const encrypt = async (textPlain) =>{
    const hash = await bcrypt.hash(textPlain,10);
    return hash;
}

const verifyPassword = (txtPlain, hash) =>{
    try {
        return bcrypt.compareSync(txtPlain, hash);
    } catch (error) {
        console.log("Verify: "+error);
        return false;
    }
}


module.exports = {encrypt, verifyPassword};