const sequelize = require('./dbConex.js');

const BuscarProductoID= async (id) => {
    //console.log(usuario);
    return await sequelize.query(`SELECT * FROM bddelilahresto.productos WHERE id = ${id};`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarProductoIds= async (idsproductos) => {
    //console.log(usuario);
    return await sequelize.query(`SELECT * FROM bddelilahresto.productos WHERE id in (${idsproductos});`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

module.exports = {
    BuscarProductoID,
    BuscarProductoIds
};