const sequelize = require('./dbConex.js');
var express = require('express'); 
var app = express();              
app.use(express.json());
const port = 5000;


// PRODUCTOS GET

const validarTipoDatoId = (req, res, next) =>{
    const {id} = req.params;
    console.log(req.params);
    if (id <= 0 || !Number(id)) {
        res.status(400).json('El id del producto debe ser numerico y mayor de cero');
    }else{      
        return next();
    }
};

app.get('/productos/:id', validarTipoDatoId,(req, res) => {
    console.log(req.params.id);    
    sequelize.query('SELECT * FROM bddelilahresto.productos WHERE id = ?;',
    {replacements:[req.params.id],
    type: sequelize.QueryTypes.SELECT}  
    ).then(result =>{
        if (result == "") {
            res.send('El producto no existe =(' );
            console.log('EL producto no existe =(' );
        }else{
            res.status(200).json(result);
            console.log(result);                       
        }
       
    }).catch(err=>{
        res.status(500).json(err);
    })    
});


app.listen(port, function () {     
    console.log('El servidor express corre en el puerto ' + port);
});