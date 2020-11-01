
const sequelize = require('./dbConex.js');
const validarToken = require('./validarToken');
const jwt = require('jsonwebtoken');

var express = require('express'); 
var app = express();              
app.use(express.json());

const port = 5000;


// ENDPOINTS PEDIDOS 

// PEDIDOS POST

let pedidos = [
    {idPedido:1, idProducto: 4, idEstadoPedido: 1, idUsuario: 11, horaPedido: "1800", descripcionPedido: "2x Focaccia", idMedioDePago: 1, totalXpagar: 1200},
    {idPedido:2, idProducto: 5, idEstadoPedido: 2, idUsuario: 12, horaPedido: "2000", descripcionPedido: "2x hamb", idMedioDePago: 2, totalXpagar: 2000},
    {idPedido:3, idProducto: 6, idEstadoPedido: 3, idUsuario: 13, horaPedido: "1700", descripcionPedido: "2x salch", idMedioDePago: 1, totalXpagar: 5000}
]
const validarDatosPedido = (req, res, next) => {
    const {idProducto, idEstadoPedido, idUsuario, horaPedido, descripcionPedido, idMedioDePago, totalXpagar} = req.body;   
    if (!idProducto || !idEstadoPedido || !idUsuario || !horaPedido ||!descripcionPedido ||!idMedioDePago || !totalXpagar)
        return res.status(400).json('datos invalidos');      
    if(idEstadoPedido < 1 || idEstadoPedido > 6)
        return res.send("ingrese un numero del 1 al 6");     
    if (idMedioDePago !== 1 && idMedioDePago !== 2 )
        return res.send('Ingrese 1 para pago con EFECTIVO ó 2 para pago con TARJETA');              
    return next();
}

app.post('/pedido',validarDatosPedido, (req, res) => {
    let crearPedido = req.body;
    pedidos.push(crearPedido);   
    res.send(pedidos).json();
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