CREATE SCHEMA `bddelilahresto` ;

-- -----------------------------------------------------
-- Table `bddelilahresto`.`estadospedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bddelilahresto`.`estadospedido` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombreEstadoPedido` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Table `bddelilahresto`.`mediosdepago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bddelilahresto`.`mediosdepago` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombreMedioDePago` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Table `bddelilahresto`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bddelilahresto`.`productos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombrePto` VARCHAR(100) NOT NULL,
  `precio` INT NOT NULL,
  `nombreCorto` VARCHAR(20) NOT NULL,
  `favorito` INT NOT NULL,
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Table `bddelilahresto`.`rolusuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bddelilahresto`.`rolusuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombreRolUsuario` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Table `bddelilahresto`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bddelilahresto`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(50) NOT NULL,
  `nombreCompleto` VARCHAR(60) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `direccionEnvio` VARCHAR(150) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `idRolUsuario` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fkUsuariosRolUsuario_idx` (`idRolUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_Usuarios_RolUsuario`
    FOREIGN KEY (`idRolUsuario`)
    REFERENCES `bddelilahresto`.`rolusuario` (`id`));

-- -----------------------------------------------------
-- Table `bddelilahresto`.`pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bddelilahresto`.`pedidos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `horaPedido` TIMESTAMP NOT NULL,
  `idEstadoPedido` INT NOT NULL,
  `idUsuario` INT NOT NULL,
  `idMedioDePago` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk PedidosUsuarios_idx` (`idUsuario` ASC) VISIBLE,
  INDEX `fk PedidosEstado_idx` (`idEstadoPedido` ASC) VISIBLE,
  INDEX `fk PedidosMedioPago_idx` (`idMedioDePago` ASC) VISIBLE,
  CONSTRAINT `fk_ Pedidos_Estados`
    FOREIGN KEY (`idEstadoPedido`)
    REFERENCES `bddelilahresto`.`estadospedido` (`id`),
  CONSTRAINT `fk_Pedidos_MediosPago`
    FOREIGN KEY (`idMedioDePago`)
    REFERENCES `bddelilahresto`.`mediosdepago` (`id`),  
  CONSTRAINT `fk_Pedidos_Usuarios`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `bddelilahresto`.`usuarios` (`id`));

    /*** Ingresar opciones de medios de pago ***/

INSERT INTO `bddelilahresto`.`mediosdepago`
  (`id`,
    `nombreMedioDePago`)
    VALUES
    (NULL,
    "TDC"),
    (NULL,
    "EFECTIVO");
    
/*** Ingresar Datos estados de pedido ***/
INSERT INTO `bddelilahresto`.`estadospedido`
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
  
  /*** Ingresat opciones rol de usuario ***/
  INSERT INTO `bddelilahresto`.`rolusuario`
  (`id`,
    `nombreRolUsuario`)
    VALUES
    (NULL,
    "admin"),
     (NULL,
    "cliente");
    
INSERT INTO `bddelilahresto`.`usuarios`
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
  
  /*** ingresar datos productos ***/
INSERT INTO `bddelilahresto`.`productos`
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
   
/***ingresar datos pedidos ***/     
INSERT INTO `bddelilahresto`.`pedidos`
  (`id`,
    `horaPedido`,
    `idEstadoPedido`,
    `idUsuario`,
    `idMedioDePago`
    )
    VALUES
    (NULL,
    current_timestamp(),
    "1",
    "1",
    "1"
  );

CREATE TABLE `bddelilahresto`.`detalles_pedidos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_producto` INT NOT NULL,
  `id_pedido` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_detalle_pedido_idx` (`id_pedido` ASC) VISIBLE,
  INDEX `fk_detalle_producto_idx` (`id_producto` ASC) VISIBLE,
  CONSTRAINT `fk_detalle_pedido`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `bddelilahresto`.`pedidos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_detalle_producto`
    FOREIGN KEY (`id_producto`)
    REFERENCES `bddelilahresto`.`productos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO `bddelilahresto`.`detalles_pedidos`
(`id_producto`,`id_pedido`)
VALUES(1,1)