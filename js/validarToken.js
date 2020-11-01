
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

// Validar que el token sea verdadero
const validacionToken = (req, res, next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        jwt.verify(token, SECRET);
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json('Token no válido');
    }
}
module.exports = {
    validacionToken
}