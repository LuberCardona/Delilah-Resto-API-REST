const sequelize = require('./dbConex.js');

const queryProductos = require('./productos.js')

const BuscarPedidoPorId = async (id) => {
    //console.log(usuario);
    return await sequelize.query(`SELECT * FROM bddelilahresto.pedidos Where id = "${id}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const CrearPedidoDetalle = async (detalleOrden) => {
    //console.log(detalleOrden);
    return await sequelize.query(`INSERT INTO bddelilahresto.detalles_pedidos (id_producto,id_pedido,Cantidad)
    VALUES ("${detalleOrden.id_producto}","${detalleOrden.id_pedido}", "${detalleOrden.Cantidad}");`,
    {
        type: sequelize.QueryTypes.INSERT
    });
};

const CrearPedido = async (idUsuario,idMedioDePago) => {
    //console.log(usuario);
    return await sequelize.query(`INSERT INTO bddelilahresto.pedidos (horaPedido, idEstadoPedido, idUsuario, idMedioDePago) 
    VALUES(current_timestamp(),1,"${idUsuario}","${idMedioDePago}")`,
    {
        type: sequelize.QueryTypes.INSERT
    });
};

const validarProductosDetalles = async (productos) => {
    //console.log(productos);
    const idproductosRequest = productos.map((prod)=>prod.id_producto);
    console.log('id request '+idproductosRequest.length);
    const idproductosBD = ( await queryProductos.BuscarProductoIds(idproductosRequest)).map((prod)=>prod.id);
    console.log('id BD '+idproductosBD.length);
    if (idproductosRequest.length != idproductosBD.length) {
        const errorDetalle = idproductosRequest
            .filter((prod) => !idproductosBD.includes(prod))
            .map((prod)=>{
                //Especificar id y error del producto
                return{
                    id: prod,
                    mensaje: "El producto no existe, consulta los productos disponibles",
                }
            });
        return { error: errorDetalle };
    }
};

const crearDetalleOrden = async (id_pedido, productos) =>{
    for (const prod of productos){
        const detalleOrden={
            id_pedido,
            id_producto: prod.id_producto,           
            Cantidad: prod.Cantidad
        };
        console.log(detalleOrden);
        await CrearPedidoDetalle(detalleOrden);
    }
};

module.exports = {
    CrearPedidoDetalle,
    CrearPedido,
    validarProductosDetalles,
    crearDetalleOrden,
    BuscarPedidoPorId
};