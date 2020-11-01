const sequelize = require('./dbConex.js');
const validacion = require('./validacion');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

var express = require('express'); 
var app = express();              
app.use(express.json());

const port = 5000;

// PRODUCTOS POST

 app.post('/producto', validacion.validarDatosProducto, validacion.validacionToken, validacion.validarRol, (req,res)=>{
    
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
  app.put('/producto/:id', validacion.validarTipoDatoId,  validacion.validacionToken, validacion.validarRol, (req, res) => { 

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

app.delete('/producto/:id', validacion.validarTipoDatoId, validacion.validacionToken, validacion.validarRol, (req, res) => {    
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
  

// PRODUCTOS GET

app.get('/productos/:id', validacion.validarTipoDatoId,(req, res) => {
    console.log(req.params.id);    
    sequelize.query('SELECT * FROM bddelilahresto.productos WHERE id = ?;',
    {replacements:[req.params.id],
    type: sequelize.QueryTypes.SELECT}  
    ).then(result =>{        
        if (result == "") {            
            res.send('El producto no existe =(' ).json();
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