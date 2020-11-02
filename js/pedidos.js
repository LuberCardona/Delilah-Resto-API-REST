
const sequelize = require('./dbConex.js');
const validacion = require('./validacion');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

var express = require('express'); 
var app = express();              
app.use(express.json());

const port = 5000;


// ENDPOINTS PEDIDOS 

// PEDIDOS POST

app.post('/crearPedido',validacion.validarDatosPedido, validacion.validarIdForaneos, (req, res) => {
   sequelize.query ('INSERT INTO `pedidos`(`horaPedido`, `idProducto`, `idEstadoPedido`, `idUsuario`,`idMedioDePago`) VALUES (current_timestamp(),?,?,?,?);',
        {
        replacements:[req.body.idProducto,req.body.idEstadoPedido,req.body.idUsuario,req.body.idMedioDePago],
        type: sequelize.QueryTypes.INSERT}
        ).then(result =>{
            res.send('Pedido creado');
            console.log('Pedido creado');
        }).catch(err=>{
            res.status(500).json(err);
        }) 
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

app.get('/pedidos/:id', validacion.validarTipoDatoIdPedido,validacion.validarPedidoExiste,(req, res) => {
    let idConsultado = req.params.id;
    for (let i = 0; i < pedidos.length; i++) {
        let pedido = pedidos[i];
        if (pedido.idPedido == idConsultado) {
            res.json(pedido);
        }
    }
});


app.listen(port, function () {     
    console.log('El servidor express corre en el puerto ' + port);
});