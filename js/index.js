const sequelize = require('./dbConex.js');
const validacion = require('./validacion');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const queryPedidos = require('./pedidos.js');

var express = require('express'); 
var app = express();              
app.use(express.json());

const port = 5000;

/// ENDPOINTS DE PRODUCTOS POST, PUT, DELETE Y GET /////////////////////////////////////////////////////

// PRODUCTOS POST
 app.post('/crearProducto', validacion.validarDatosProducto, validacion.validacionToken, validacion.validarRol, (req,res)=>{
    
        sequelize.query('INSERT INTO `productos`(`nombrePto`,`precio`,`nombreCorto`,`favorito`) VALUES(?,?,?,?);',
        {
            replacements:[req.body.nombrePto,req.body.precio,req.body.nombreCorto,req.body.favorito],
            type: sequelize.QueryTypes.INSERT}
        ).then(result =>{
            res.send('Producto creado');
            console.log('Prod creado');
        }).catch(err=>{
            res.status(500).json(err);
        })    
 });

 
// PRODUCTOS PUT
  app.put('/modificarProducto/:id', validacion.validarTipoDatoId,  validacion.validacionToken, validacion.validarRol, (req, res) => { 

    sequelize.query ('UPDATE productos SET nombrePto =?, precio=?, nombreCorto=?, favorito=? WHERE id=?;',   
      {replacements:[req.body.nombrePto, req.body.precio, req.body.nombreCorto, req.body.favorito, req.params.id],
      type: sequelize.QueryTypes.UPDATE}              
    ).then(result =>{
        if (result[1] === 0) {
            res.send('El producto no existe ó no se modificó ningun campo');
        }else{
            res.send('Producto modificado');                     
        }
       
    }).catch(err=>{
        res.status(500).json(err);
    })  
    
});

// PRODUCTOS DELETE
app.delete('/eliminarProducto/:id', validacion.validarTipoDatoId, validacion.validacionToken, validacion.validarRol, (req, res) => {    
     // primero valido si existe con una consulta SELECT 
    sequelize.query('SELECT * FROM bddelilahresto.productos WHERE id = ?;',
    {replacements:[req.params.id],
    type: sequelize.QueryTypes.SELECT} 
    ).then(result =>{
        console.log(result);
        if (result == "") {
            res.send('El producto no existe')            
        }else{   // Si existe entra al esle y hace el delete
            sequelize.query ('DELETE FROM productos WHERE id = ?;',
            {replacements:[req.params.id],
            type: sequelize.QueryTypes.DELETE}  
            ).then(result =>{
               res.send('El producto ha sido eliminado');       
            }).catch(err=>{
                res.status(500).json(err);
            }) 
        } 
    }).catch(err=>{
        res.status(500).json(err);
    }) 
});
  

// PRODUCTOS GET  - listar todos los productos
app.get('/consultarProductos', (req, res) => {       
    sequelize.query('SELECT * FROM bddelilahresto.productos;',
    {type: sequelize.QueryTypes.SELECT}  
    ).then(result =>{        
        if (result == "") {            
            res.send('No hay productos para mostrar =(' ).json();
            console.log('No hay productos para mostrar =(' );
        }else{
            res.status(200).json(result);
            console.log(result);                       
        }       
    }).catch(err=>{
        res.status(500).json(err);
    })    
});

// PRODUCTOS GET - OBTENER 1 PRODUCTO POR ID
app.get('/consultarProducto/:id', validacion.validarTipoDatoId, (req, res) => {       
    sequelize.query('SELECT * FROM bddelilahresto.productos WHERE id=?;',
    {replacements:[req.params.id], type: sequelize.QueryTypes.SELECT}  
    ).then(result =>{        
        if (result == "") {            
            res.send('El producto no existe =(' ).json();
            console.log('El producto no existe  =(' );
        }else{
            res.status(200).json(result);
            console.log(result);                       
        }       
    }).catch(err=>{
        res.status(500).json(err);
    })    
});

// ENDPOINTS DE USUARIOS  POST crear, POST login y GET ///////////////////////////////////////////////////////////

// USUARIOS POST
app.post('/crearUsuario', validacion.validacionDatosUsuario, validacion.validacionDatoYaExiste, (req, res) => {    
    sequelize.query('INSERT INTO `usuarios`(`usuario`,`nombreCompleto`,`email`,`telefono`, `direccionEnvio`, `password`, `idRolUsuario`) VALUES(?,?,?,?,?,?,?);',
    { replacements:[req.body.usuario,req.body.nombreCompleto,req.body.email,req.body.telefono, req.body.direccionEnvio, req.body.password, req.body.idRolUsuario],
        type: sequelize.QueryTypes.INSERT}
    ).then(result =>{
        res.send('Usuario creado');            
    }).catch(err=>{
        res.status(500).json(err);
    })   
});

 // USUARIOS LOGIN -  validar usuario y contraseña y obtener el token
app.post('/loginUsuario', (req, res)=>{    
    sequelize.query ('SELECT * FROM bddelilahresto.usuarios WHERE usuario = ? AND password = ?;',
    {replacements:[req.body.usuario, req.body.password],
    type: sequelize.QueryTypes.SELECT}
    ).then(result =>{ 
        console.log(result);     
        for (let i = 0; i < result.length; i++) {        
            if (result[i].usuario == req.body.usuario && result[i].password == req.body.password) {
               const payload = {
                   usuarioLogin: result[i].usuario,
                   rolLogin: result[i].idRolUsuario
               }
               const token = jwt.sign(payload, SECRET);
               res.status(200).json({ token });
               console.log(token);
            }       
        }
        if (result == '') {
            res.status(401).json('Usuario o contraseña invalidos');
            console.log('Usuario o contraseña invalidos');
        }       
    }).catch(err=>{
        res.status(500).json(err);
    })      
});

// GET - usuarios 
app.get('/infoUsuarios', validacion.validacionToken, validacion.validarRol, (req, res)=>{        
    
        sequelize.query ('SELECT * FROM bddelilahresto.usuarios;',
        {type: sequelize.QueryTypes.SELECT}
        ).then(result =>{ 
            res.status(200).json(result);
            console.log(result);
        }).catch(err=>{
            res.status(500).json(err);
        })           
})


// ENDPOINTS PEDIDOS  POST, PUR, DELETE Y GET//////////////////////////////////////////////////////////////


 app.post('/crearPedido', validacion.validacionToken, async(req,res)=>{
    try{
        const ValidarProductos = await queryPedidos.validarProductosDetalles(req.body.productos);
        //Si no existe un producto reportar error
        if (ValidarProductos && ValidarProductos.error)
        return res
          .status(400)
          .json({ error: 400, errorDetalle: ValidarProductos.error });
          //console.log('admin id: ' + req.body.id);
        const crearPedido = await queryPedidos.CrearPedido(req.body.idUsuario,req.body.idMedioDePago);
        //console.log('id del pedido: ' + crearPedido[0]);
        await queryPedidos.crearDetalleOrden(crearPedido[0],req.body.productos);
        res.json(req.body);
    }  catch (error) {
    res.status(500).json({ error: error.message });
    }
});


 
 // PEDIDOS PUT
 app.put('/modificarPedido/:id', validacion.validarTipoDatoIdPedido,validacion.validarPedidoExiste, validacion.validacionToken, validacion.validarRol,(req, res) => {
 
     sequelize.query ('UPDATE pedidos SET idEstadoPedido=? WHERE id=?;',   
       {replacements:[req.body.idEstadoPedido, req.params.id],
       type: sequelize.QueryTypes.UPDATE}              
     ).then(result =>{
         res.send('Estado del pedido modificado'); 
         console.log('Estado del pedido modificado');
     }).catch(err=>{
         res.status(500).json(err);
     })  
     
 });
 
 // PEDIDOS DELETE
 app.delete('/eliminarPedido/:id', validacion.validarTipoDatoIdPedido,validacion.validarPedidoExiste, validacion.validacionToken, validacion.validarRol, (req, res) => {    
 
     sequelize.query ('DELETE FROM pedidos WHERE id = ?;',
         {replacements:[req.params.id],
         type: sequelize.QueryTypes.DELETE}  
     ).then(result =>{
         res.send('El pedido ha sido eliminado');   
         console.log('pedido eliminado');    
     }).catch(err=>{
         res.status(500).json(err);
     })   
 });
 
 // PEDIDOS GET
 app.get('/consultarPedidos', validacion.validacionToken, validacion.validarRol,(req, res) => {
 
     sequelize.query (`SELECT 
     E.nombreEstadoPedido AS ESTADO,
     P.id AS NUMERO_PEDIDO
     ,U.nombreCompleto AS USUARIO
     ,TP.nombreMedioDePago AS MEDIO_DE_PAGO
     ,(Select  sum((precio) * (Cantidad))
     from bddelilahresto.detalles_pedidos ped
     join bddelilahresto.productos prod
     on ped.id_producto = prod.id
     where  id_pedido = P.id) AS PAGO_TOTAL
     
     ,(Select  group_concat(prod.nombreCorto, " X ", Cantidad)
     from bddelilahresto.detalles_pedidos ped
     join bddelilahresto.productos prod
          on ped.id_producto = prod.id
     where  id_pedido = P.id
     group by id_pedido) AS DESCRIPCION  
            
     ,P.horaPedido AS HORA_PEDIDO
     
     FROM bddelilahresto.pedidos P
     JOIN bddelilahresto.usuarios U
          on P.idUsuario =  U.id
     JOIN bddelilahresto.mediosdepago TP 
          on p.idMedioDePago = TP.id
     JOIN bddelilahresto.estadospedido E 
          on p.idEstadoPedido = E.id;`,
         {type: sequelize.QueryTypes.SELET}  
         ).then(result =>{
             res.send(result);   
             console.log(result);    
         }).catch(err=>{
             res.status(500).json(err);
         })    
 });

app.listen(port, function () {     
    console.log('El servidor express corre en el puerto ' + port);
});