
/*** Crear tabla estados del pedido***/
CREATE TABLE `estadospedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreEstadoPedido` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8
;

/*** Ingresar Datos estados de pedido ***/
INSERT INTO `estadospedido`
	(`id`,
	`nombreEstadoPedido`)
	VALUES
	(NULL,
	"NUEVO"),
	(NULL,
	"CONFIRMADO"),
	(NULL,
	"PREPARANDO"),
	(NULL,
	"ENVIANDO"),
	(NULL,
	"CANCELADO"),
	(NULL,
	"ENTREGADO");

/*** Crear tabla medios de pago***/
CREATE TABLE `mediosdepago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreMedioDePago` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8
;
    
/*** Ingresar opciones de medios de pago ***/
INSERT INTO `mediosdepago`
	(`id`,
    `nombreMedioDePago`)
    VALUES
    (NULL,
    "TDC"),
    (NULL,
    "EFECTIVO");

/*** Crear tabla rol de usuario***/
CREATE TABLE `rolusuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreRolUsuario` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8
;
    
/*** Ingresat opciones rol de usuario ***/
  INSERT INTO `rolusuario`
	(`id`,
    `nombreRolUsuario`)
    VALUES
    (NULL,
    "admin"),
     (NULL,
    "cliente");
    
/*** Crear tabla de usuarios***/
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `nombreCompleto` varchar(60) NOT NULL,
  `email` varchar(45) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `direccionEnvio` varchar(150) NOT NULL,
  `password` varchar(30) NOT NULL,
  `idRolUsuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fkUsuariosRolUsuario_idx` (`idRolUsuario`),
  CONSTRAINT `fkUsuariosRolUsuario` FOREIGN KEY (`idRolUsuario`) REFERENCES `rolusuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8
;


/*** Ingresar datos de usuarios ***/
INSERT INTO `usuarios`
	(`id`,
	`usuario`,
	`nombreCompleto`,
	`email`,
	`telefono`,
    `direccionEnvio`,
	`password`,
	`idRolUsuario`)
	VALUES
	(NULL,
	"admin",
	"administrador",
	"administrador@email.com",
	"1234456",
  "cl 1 n 2 -3",
	"admin1234",
	"1"),
    (NULL,
	"cliente",
	"cliente",
	"cliente@email.com",
	"5678910",
  "cl 2 n 3 - 4",
	"cliente1234",
	"2"),
  (NULL,
	"Freddie",
	"Freddie Mercury",
	"freddie@gmail.com",
	"7712345678",
  "1 logan, London",
	"freddie1234",
	"2");

/*** Crear tabla de productos***/
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombrePto` varchar(100) NOT NULL,
  `precio` int NOT NULL,
  `nombreCorto` varchar(20) NOT NULL,
  `favorito` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8
;

    
/*** ingresar datos productos ***/
INSERT INTO `productos`
	(`id`,
	`nombrePto`,
	`precio`,
	`nombreCorto`,
	`favorito`)
	VALUES
	(NULL,
	"Hamburguesa clásica",
	"350",
	"HamClas",
	 0),
	(NULL,
	"Sandwich veggie",
	"310",
	"SandVegg",
	 1),
     (NULL,
	"Sandwich queso",
	"268",
	"SanQueso",
	 1);

/*** Crear tabla pedidos***/
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `horaPedido` timestamp NOT NULL,
  `descripcionPedido` varchar(255) NOT NULL,
  `idProducto` int NOT NULL,
  `idEstadoPedido` int NOT NULL,
  `idUsuario` int NOT NULL,
  `idMedioDePago` int NOT NULL,
  `totalXPagar` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk PedidosUsuarios_idx` (`idUsuario`),
  KEY `fk PedidosProductos_idx` (`idProducto`),
  KEY `fk PedidosEstado_idx` (`idEstadoPedido`),
  KEY `fk PedidosMedioPago_idx` (`idMedioDePago`),
  CONSTRAINT `fk PedidosEstado` FOREIGN KEY (`idEstadoPedido`) REFERENCES `estadospedido` (`id`),
  CONSTRAINT `fk PedidosMedioPago` FOREIGN KEY (`idMedioDePago`) REFERENCES `mediosdepago` (`id`),
  CONSTRAINT `fk PedidosProductos` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`),
  CONSTRAINT `fk PedidosUsuarios` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8
;
     
/***ingresar datos pedidos ***/     
INSERT INTO `pedidos`
	(`id`,
    `horaPedido`,
    `descripcionPedido`,
    `idProducto`,
    `idEstadoPedido`,
    `idUsuario`,
    `idMedioDePago`,
    `totalXPagar`
    )
    VALUES
    (NULL,
    current_timestamp(),
    "descripcion pedido",
    "1",
    "1",
    "1",
    "1",
    "660"
  );
    
   
  
    
  
    
    




    