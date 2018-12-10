-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 10-12-2018 a las 01:05:06
-- Versión del servidor: 5.7.23
-- Versión de PHP: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `notagame`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `building`
--

DROP TABLE IF EXISTS `building`;
CREATE TABLE IF NOT EXISTS `building` (
  `id_building` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `cps` float NOT NULL,
  `cpsMultiplier` float NOT NULL,
  `cost` float NOT NULL,
  `costMultiplier` float NOT NULL,
  PRIMARY KEY (`id_building`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `building`
--

INSERT INTO `building` (`id_building`, `name`, `cps`, `cpsMultiplier`, `cost`, `costMultiplier`) VALUES
(1, 'Homeless', 5, 1.5, 10, 1.5),
(2, 'Shelter', 10, 1.5, 50, 1.5),
(3, 'Appartment', 100, 1.5, 250, 1.5),
(4, 'House', 1000, 1.5, 3000, 1.5),
(5, 'Palace', 2000, 1.5, 50000, 1.5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `upgrade`
--

DROP TABLE IF EXISTS `upgrade`;
CREATE TABLE IF NOT EXISTS `upgrade` (
  `id_upgrade` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `cost` float NOT NULL,
  `multiplier` float NOT NULL,
  `multiplierName` varchar(20) NOT NULL,
  PRIMARY KEY (`id_upgrade`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `upgrade`
--

INSERT INTO `upgrade` (`id_upgrade`, `name`, `cost`, `multiplier`, `multiplierName`) VALUES
(1, '+10% CPS', 250, 0.1, 'buildingMultiplier'),
(2, '+10% CPM', 500, 0.1, 'cpmMultiplier'),
(3, '+10% Cost reduction', 1000, -0.1, 'buildingCost');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` varchar(20) NOT NULL,
  `cookies` int(11) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id_user`, `cookies`) VALUES
('162355874570960896', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_building`
--

DROP TABLE IF EXISTS `user_building`;
CREATE TABLE IF NOT EXISTS `user_building` (
  `id_user` varchar(20) NOT NULL,
  `id_building` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  PRIMARY KEY (`id_user`,`id_building`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_upgrade`
--

DROP TABLE IF EXISTS `user_upgrade`;
CREATE TABLE IF NOT EXISTS `user_upgrade` (
  `id_user` varchar(20) NOT NULL,
  `id_upgrade` int(11) NOT NULL,
  PRIMARY KEY (`id_user`,`id_upgrade`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
