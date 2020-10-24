const Sequelize = require('sequelize');
require('dotenv').config();

const seq = new Sequelize('bddelilahresto',process.env.USER, process.env.PASS,
{
    dialect:'mysql',
    host: '127.0.0.1'
});

seq.authenticate().then(()=>{
    console.log('Conectado a la BD');
}).catch(err=>{
    console.log(err);
});

module.exports = seq;