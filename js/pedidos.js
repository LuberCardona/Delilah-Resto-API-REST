
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

app.post('/crearPedido',validacion.validarDatosPedido, (req, res) => {

   /* sequelize.query ('INSERT INTO `pedidos` (`horaPedido`, `descripcionPedido`, `idProducto`, `idEstadoPedido`, `idUsuario`,`idMedioDePago`, `totalXPagar`) VALUES (current_timestamp(),"descripcion pedido", "1", "1","1", "1","660");',*/

   sequelize.query ('INSERT INTO `pedidos` (`horaPedido`, `descripcionPedido`, `idProducto`, `idEstadoPedido`, `idUsuario`,`idMedioDePago`, `totalXPagar`) VALUES (current_timestamp(),?,?,?,?,?,?);',
        {
        replacements:[req.body.descripcionPedido,req.body.idProducto,req.body.idEstadoPedido,
                      req.body.idUsuario,req.body.idMedioDePago,req.body.totalXpagar],
        type: sequelize.QueryTypes.INSERT}
        ).then(result =>{
            res.send('Pedido creado');
            console.log('Pedido creado');
        }).catch(err=>{
            res.status(500).json(err);
        }) 
});


// PEDIDOS PUT
app.put('/pedido', (req, res) => {
    let modificarPedido = req.params;             
    res.send(modificarPedido);
    
});

// PEDIDOS GET

const validarTipoDatoIdPedido = (req, res, next) =>{
    const {id} = req.params;
    if (id > 0 || Number(id)) {
        return next();
    }else{
        res.status(400).json('El id del pedido debe ser numerico y mayor de cero');
    }
};
const validarPedidoExiste = (req, res, next) => {
    const {id} = req.params;    
    const i = pedidos.findIndex(listapedidos => {
        return listapedidos.idPedido == id;
    });   
    if (i <= 0) {
        return res.status(404).json('El pedido no existe');
    }
    return next();
};

app.get('/pedidos/:id', validarTipoDatoIdPedido,validarPedidoExiste,(req, res) => {
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