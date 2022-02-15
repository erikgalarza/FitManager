cedu-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-12-2021 a las 02:36:12
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 7.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdd_fit_manager`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fit_administrador`
--

CREATE TABLE `fit_administrador` (
  `id_administrador` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fit_cliente`
--

CREATE TABLE `fit_cliente` (
  `cedula` varchar(10) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `password` varchar(200) NOT NULL,
  `impedimentos` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fit_ejercicios`
--

CREATE TABLE `fit_ejercicios` (
  `id_ejercicios` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `imagen` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fit_pago`
--

CREATE TABLE `fit_pago` (
  `id_pago` int(11) NOT NULL,
  `cedula_cliente` varchar(10) NOT NULL,
  `valor_cancelado` float NOT NULL,
  `id_membresia` int(11) NOT NULL,
  `fecha_pago` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fit_venta`
--

CREATE TABLE `fit_venta` (
  `id_venta` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_cancelado` float NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fk_progreso`
--

CREATE TABLE `fk_progreso` (
  `id_progeso` int(11) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `peso` float NOT NULL,
  `altura` float NOT NULL,
  `imc` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ft_asignacion_rutina`
--

CREATE TABLE `ft_asignacion_rutina` (
  `cedula` varchar(10) NOT NULL,
  `id_rutina` int(11) NOT NULL,
  `dia_asginado` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ft_membresia`
--

CREATE TABLE `ft_membresia` (
  `id_membresia` int(11) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `notificado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ft_rutina`
--

CREATE TABLE `ft_rutina` (
  `id_rutina` int(11) NOT NULL,
  `ejercicios` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`ejercicios`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `fit_administrador`
--
ALTER TABLE `fit_administrador`
  ADD PRIMARY KEY (`id_administrador`);

--
-- Indices de la tabla `fit_cliente`
--
ALTER TABLE `fit_cliente`
  ADD PRIMARY KEY (`cedula`);

--
-- Indices de la tabla `fit_ejercicios`
--
ALTER TABLE `fit_ejercicios`
  ADD PRIMARY KEY (`id_ejercicios`);

--
-- Indices de la tabla `fit_pago`
--
ALTER TABLE `fit_pago`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `FK_pago` (`id_membresia`),
  ADD KEY `FK_cliente` (`cedula_cliente`);

--
-- Indices de la tabla `fit_venta`
--
ALTER TABLE `fit_venta`
  ADD PRIMARY KEY (`id_venta`);

--
-- Indices de la tabla `fk_progreso`
--
ALTER TABLE `fk_progreso`
  ADD PRIMARY KEY (`id_progeso`),
  ADD KEY `fk_progreso` (`cedula`);

--
-- Indices de la tabla `ft_asignacion_rutina`
--
ALTER TABLE `ft_asignacion_rutina`
  ADD KEY `FK_asignacion` (`cedula`),
  ADD KEY `FK_rutina` (`id_rutina`);

--
-- Indices de la tabla `ft_membresia`
--
ALTER TABLE `ft_membresia`
  ADD PRIMARY KEY (`id_membresia`),
  ADD KEY `FK_membresia` (`cedula`);

--
-- Indices de la tabla `ft_rutina`
--
ALTER TABLE `ft_rutina`
  ADD PRIMARY KEY (`id_rutina`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `fit_administrador`
--
ALTER TABLE `fit_administrador`
  MODIFY `id_administrador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fit_ejercicios`
--
ALTER TABLE `fit_ejercicios`
  MODIFY `id_ejercicios` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fit_pago`
--
ALTER TABLE `fit_pago`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fit_venta`
--
ALTER TABLE `fit_venta`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fk_progreso`
--
ALTER TABLE `fk_progreso`
  MODIFY `id_progeso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ft_membresia`
--
ALTER TABLE `ft_membresia`
  MODIFY `id_membresia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ft_rutina`
--
ALTER TABLE `ft_rutina`
  MODIFY `id_rutina` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `fit_pago`
--
ALTER TABLE `fit_pago`
  ADD CONSTRAINT `FK_cliente` FOREIGN KEY (`cedula_cliente`) REFERENCES `fit_cliente` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_pago` FOREIGN KEY (`id_membresia`) REFERENCES `ft_membresia` (`id_membresia`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `fk_progreso`
--
ALTER TABLE `fk_progreso`
  ADD CONSTRAINT `fk_progreso` FOREIGN KEY (`cedula`) REFERENCES `fit_cliente` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ft_asignacion_rutina`
--
ALTER TABLE `ft_asignacion_rutina`
  ADD CONSTRAINT `FK_asignacion` FOREIGN KEY (`cedula`) REFERENCES `fit_cliente` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_rutina` FOREIGN KEY (`id_rutina`) REFERENCES `ft_rutina` (`id_rutina`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ft_membresia`
--
ALTER TABLE `ft_membresia`
  ADD CONSTRAINT `FK_membresia` FOREIGN KEY (`cedula`) REFERENCES `fit_cliente` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
