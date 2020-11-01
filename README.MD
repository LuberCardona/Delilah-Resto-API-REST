# Prerrequisitos
1. Instalar node.js.
2. Instalar mysql2. Tener presente el usuario y contraseña ya que se usara posteriormente en el archivo de variables de entorno
3. postman


# Instalación de dependencias
---
1. Ejecutar `npm i -g nodemon`.
2. Ejecutar `npm i express`.
3. Ejecutar `npm i sequelize`.
4. Ejecutar `npm i mysql2`.
5. Ejecutar `npm i dotenv`.
6. Ejecutar `npm i jsonwebtoken`.

# ejecutar script para crear la bd
1. crear la base de datos en mysql ejecutando el codigo en el scrip_BD.sql que se encuentra dentro de la carpeta db




# Ejecutar aplicación 
---
1. Ejecutar  `node pedidos.js ` ó `nodemon pedidos.js`. 
2. Ejecutar  `node productos.js` ó `nodemon productos.js` .
3. Ejecutar  `node usuarios.js` ó `nodemon usuarios.js`.

# Crear variables de entorno 
1. crear un archivo .env dentro de la carpeta js
2. Crear la variable USER en el  archivo .env y asignarle como valor el usuario  de mysql2
3. Crear la variable PASS en el  archivo .env y asignarle como valor la contraseña de mysql2



# crear variable de entorno para el secreto del token
1. crear la variable  SECRET y asignarle en valor con el secreto para el token #############????????????



