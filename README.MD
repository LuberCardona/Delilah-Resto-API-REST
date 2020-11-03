
API REST - Delilah Resto

Pasos para la ejecucion del proyecto

# Prerrequisitos
1. Instalar node.js.
2. Instalar mysql2. Tener presente el usuario y contraseña para posteriores usos.
3. Instalar Postman


# Instalación de dependencias
---
1. Ejecutar en consola `npm i -g nodemon`.
2. Ejecutar en consola `npm i express`.
3. Ejecutar en consola `npm i sequelize`.
4. Ejecutar en consola `npm i mysql2`.
5. Ejecutar en consola `npm i dotenv`.
6. Ejecutar en consola `npm i jsonwebtoken`.

# Ejecutar script  para crear la base de datos
1. crear la base de datos en mysql ejecutando el codigo que hay en el archivo scrip_BD.sql que se encuentra dentro de la carpeta db.


# Crear variables de entorno 
1. crear un archivo .env dentro de la carpeta js
2. crear las siguientes variables en el archivo .env asignandoles valores para la conexion y generacion de token:

   USER=
   PASS=
   SECRET=

Nota: USER y PASS para la conexion a la base de datos 
      Ejemplo :  USER=root
                 PASS=1234

      SECRET para la generacion del token 
      Ejemplo :  SECRET=llave


# Ejecutar la aplicación 
1. Ejecutar en la consola `node index.js ` ó `nodemon index.js`. 


# Ejecutar las consultas a cada uno de los Endpoints
En el archivo spec.yml estan especificados los parametros para el manejo de cada uno de los Endpoints.

A continuación se indican las url de los endpoints a consultar

1. Endpoints de USUARIOS 

POST  
http://localhost:5000/crearUsuario

POST para el login de usuario:
http://localhost:5000/login
*Al ejecutar esta consulta correctamente se generara el token, éste será el que debe ingresar en Authorization o en los headers para las consultas que lo requieran.

GET
http://localhost:5000/infoUsuarios


2. Endpoints de PRODUCTOS

POST
http://localhost:5000/crearProducto

PUT
http://localhost:5000/modificarProducto/

DELETE
http://localhost:5000/eliminarProducto/

GET listar todos los productos
http://localhost:5000/consultarProductos

GET consultar un solo producto por id
http://localhost:5000/consultarProducto/

3. Endpoints de PEDIDOS 

POST
http://localhost:5000/crearPedido

PUT
http://localhost:5000/modificarPedido/

DELETE
http://localhost:5000/EliminarPedido/

GET 
http://localhost:5000/consultarPedidos






