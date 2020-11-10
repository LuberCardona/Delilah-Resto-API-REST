
const sequelize = require('./dbConex.js');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;


// Datos PRODUCTOS en el body de la peticion
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
    const {idProducto, idEstadoPedido, idUsuario, idMedioDePago} = req.body;   
    if (!idProducto || !idEstadoPedido || !idUsuario ||!idMedioDePago)
        return res.status(400).json('datos invalidos');      
    if(idEstadoPedido < 1 || idEstadoPedido > 6)
        return res.send("ingrese un numero del 1 al 6 , 1 NUEVO , 2 CONFIRMADO, 3 PREPARANDO, 4 ENVIANDO, 5 CANCELADO, 6 ENTREGADO");     
    if (idMedioDePago !== 1 && idMedioDePago !== 2 )
        return res.send('Ingrese 1 para pago con EFECTIVO ó 2 para pago con TARJETA');              
    return next();
}
// tipo de dato id pedidos en params
const validarTipoDatoIdPedido = (req, res, next) =>{
    const {id} = req.params;
    if (id > 0 || Number(id)) {
        return next();
    }else{
        res.status(400).json('El id del pedido debe ser numerico y mayor de cero');
    }
};

// validar si los id del producto y el usuario existen para la descripcion del pedido y direccion de envio.
const validarIdForaneos = (req, res, next) => {
    sequelize.query('SELECT * FROM bddelilahresto.productos WHERE id = ?;',
    {replacements:[req.body.idProducto],
         type: sequelize.QueryTypes.SELECT} 
    ).then(result =>{
      console.log(result);
        if (result == "") {
            res.send('El id del producto a anexar al pedido no existe')
        } 
    }).catch(err=>{
        res.status(500).json(err);
    }) 

    sequelize.query('SELECT * FROM bddelilahresto.usuarios WHERE id = ?;',
        {replacements:[req.body.idUsuario],
             type: sequelize.QueryTypes.SELECT} 
        ).then(result =>{
          console.log(result);
            if (result == "") {
                res.send('Por favor asignar un cliente existente para el envio del pedido')
            }
            next();
        }).catch(err=>{
            res.status(500).json(err);
        })

};




// validar si el pedido existe para eliminarlo o editarlo
const validarPedidoExiste = (req, res, next) => {
    sequelize.query('SELECT * FROM bddelilahresto.pedidos WHERE id = ?;',
       {replacements:[req.params.id], type: sequelize.QueryTypes.SELECT} 
    ).then(result =>{
      console.log(result);
        if (result == "") {
            res.send('El pedido no existe')
        }else{
            next();
        }
    }).catch(err=>{
        res.status(500).json(err);
    }) 

};




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
    validarTipoDatoIdPedido,
    validarIdForaneos,
    validarPedidoExiste,
    validacionDatosUsuario,
    validacionDatoYaExiste,
    validacionToken,
    validarRol    
}

