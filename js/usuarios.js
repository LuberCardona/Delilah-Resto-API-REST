const sequelize = require('./dbConex.js');
const validacion = require('./validacion');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

var express = require('express'); 
var app = express();              
app.use(express.json());

const port = 5000;


// ENDPOINTS DE USUARIOS
// USUARIOS POST


app.post('/usuario', validacion.validacionDatosUsuario, validacion.validacionDatoYaExiste, (req, res) => {    
    sequelize.query('INSERT INTO `usuarios`(`usuario`,`nombreCompleto`,`email`,`telefono`, `direccionEnvio`, `password`, `idRolUsuario`) VALUES(?,?,?,?,?,?,?);',
    { replacements:[req.body.usuario,req.body.nombreCompleto,req.body.email,req.body.telefono, req.body.direccionEnvio, req.body.password, req.body.idRolUsuario],
        type: sequelize.QueryTypes.INSERT}
    ).then(result =>{
        res.send('Usuario creado');            
    }).catch(err=>{
        res.status(500).json(err);
    })   
});

 // validar usuario y contraseña y obtener el token
app.post('/login', (req, res)=>{    
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

app.get('/info', validacion.validacionToken, validacion.validarRol, (req, res)=>{        
    
        sequelize.query ('SELECT * FROM bddelilahresto.usuarios;',
        {type: sequelize.QueryTypes.SELECT}
        ).then(result =>{ 
            res.status(200).json(result);
            console.log(result);
        }).catch(err=>{
            res.status(500).json(err);
        })           
})

app.listen(port, function () {     
    console.log('El servidor express corre en el puerto ' + port);
});