
const sequelize = require('./dbConex.js');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;


// Datos PRODUCTOS 
const validarDatosProducto = (req, res, next) => {
    let {nombrePto, precio, nombreCorto, favorito } = req.body;
    if (!nombrePto || !precio || !nombreCorto || !favorito) {
        return res.status(400).json('Datos no validos');
    }
    return next();
 }

//  validar tipo de dato id para  PUT, DELETE Y GET -  PRODUCTOS 
const validarTipoDatoId = (req, res, next) =>{
    const {id} = req.params;
    console.log(req.params);
    if (id <= 0 || !Number(id)) {
        res.status(400).json('El id del producto debe ser numerico y mayor de cero');
    }else{      
        return next();
    }
};
// datos en body PEDIDO
const validarDatosPedido = (req, res, next) => {
    const {idProducto, idEstadoPedido, idUsuario, descripcionPedido, idMedioDePago, totalXpagar} = req.body;   
    if (!idProducto || !idEstadoPedido || !idUsuario  ||!descripcionPedido ||!idMedioDePago || !totalXpagar)
        return res.status(400).json('datos invalidos');      
    if(idEstadoPedido < 1 || idEstadoPedido > 6)
        return res.send("ingrese un numero del 1 al 6");     
    if (idMedioDePago !== 1 && idMedioDePago !== 2 )
        return res.send('Ingrese 1 para pago con EFECTIVO ó 2 para pago con TARJETA');              
    return next();
}

//validacion datos ingresados al body  - USUARIOS
const validacionDatosUsuario = (req, res, next) => {
    let {usuario, nombreCompleto, email, telefono, direccionEnvio, password, idRolUsuario} = req.body;
        if (!usuario || !nombreCompleto || !email || !telefono || !direccionEnvio || !password || !idRolUsuario) {
            return res.status(400).json('datos no validos');
        }
        if (idRolUsuario !== 1 && idRolUsuario !== 2 ) {
            return res.send('Debe ingresar el número "1" para Rol de ADMIN ó el número "2" para Rol CLIENTE');
        }   
        if (password.length < 8){
         return res.send('La contraseña debe contener minimo 8 caracteres')
        }  
    return next();
        
}
 // validar si usuario o email ya existe antes de permitir crear un nuevo usuario  -  USUARIOS
const validacionDatoYaExiste = (req, res, next) => {
    sequelize.query ('SELECT * FROM bddelilahresto.usuarios WHERE usuario = ? OR email = ?;',
    {replacements:[req.body.usuario, req.body.email],
    type: sequelize.QueryTypes.SELECT}
    ).then(result =>{       
        for (let i = 0; i < result.length; i++) {        
            if (result[i].usuario == req.body.usuario || result[i].email == req.body.email) {
            return res.send('usuario o email ya existe');
            }
        }
        return next();
    }).catch(err=>{
    res.status(500).json(err);
    })   
};

// Validar que el token sea verdadero - TOKEN
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

// ROL
const validarRol = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const payload = jwt.decode(token);
        if (payload.rolLogin === 1){ 
            next();
        }else{
            res.status(401).json('Usuario no autorizado para realizar esta acción');
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    validarDatosProducto,   
    validarTipoDatoId,
    validarDatosPedido,
    validacionDatosUsuario,
    validacionDatoYaExiste,
    validacionToken,
    validarRol
    
}

