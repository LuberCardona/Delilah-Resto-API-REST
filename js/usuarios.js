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

//validacion datos ingresados al body
const validacionDatosUsuario = (req, res, next) => {
    let {usuario, nombreCompleto, email, telefono, direccionEnvio, password, idRolUsuario} = req.body;
        if (!usuario || !nombreCompleto || !email || !telefono || !direccionEnvio || !password || !idRolUsuario) {
            return res.status(400).json('datos no validos');
        }
        if (idRolUsuario !== 1 && idRolUsuario !== 2 ) {
            return res.send('Debe ingresar el número "1" para Rol de ADMIN ó el número "2" para Rol CLIENTE');
        }   
        if (password.length < 8){
         return res.send('La contraseña debe contener minimo 8 caracteres')
        }  
    return next();
        
}
 // validar si usuario o email ya existe antes de permitir crear un nuevo usuario
const validacionDatoYaExiste = (req, res, next) => {
    sequelize.query ('SELECT * FROM bddelilahresto.usuarios WHERE usuario = ? OR email = ?;',
    {replacements:[req.body.usuario, req.body.email],
    type: sequelize.QueryTypes.SELECT}
    ).then(result =>{       
        for (let i = 0; i < result.length; i++) {        
            if (result[i].usuario == req.body.usuario || result[i].email == req.body.email) {
            return res.send('usuario o email ya existe');
            }
        }
        return next();
    }).catch(err=>{
    res.status(500).json(err);
    })   
};

app.post('/usuario', validacionDatosUsuario, validacionDatoYaExiste, (req, res) => {    
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