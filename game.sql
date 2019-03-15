-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 15, 2019 at 04:02 AM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `game`
--

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
CREATE TABLE IF NOT EXISTS `event` (
  `id_event` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `date` bigint(20) NOT NULL,
  `quota` int(11) DEFAULT NULL,
  `photo_cover` varchar(100) DEFAULT NULL,
  `photo_thumbnail` varchar(100) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_event`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id_event`, `name`, `description`, `date`, `quota`, `photo_cover`, `photo_thumbnail`, `active`) VALUES
(1, 'Prueba', ' ', 0, NULL, NULL, NULL, 1),
(2, 'Prueba 2', ' ', 0, NULL, NULL, NULL, 1),
(3, 'Evento Participando', ' ', 0, NULL, NULL, NULL, 1),
(4, 'carga', 'prueba', 1547863281894, 100, NULL, NULL, 1),
(5, 'carga', 'prueba', 1547863281894, 100, NULL, NULL, 1),
(6, 'carga', 'prueba', 1547863281894, 100, NULL, NULL, 1),
(7, 'carga', 'prueba', 1547863281894, 100, NULL, NULL, 1),
(8, 'a', 'b', 1, 1, 'logo_2x.png', 'profile.png', 1),
(9, 'a', 'b', 1, 1, 'logo_2x.png', 'profile.png', 1),
(10, 'a', 'b', 1, 1, 'logo_2x.png', 'profile.png', 1),
(11, 'a', NULL, 4, NULL, 'logo_2x.png', 'profile.png', 1),
(12, 'a', NULL, 58, NULL, NULL, NULL, 1),
(13, 'a', NULL, 60, NULL, NULL, NULL, 1),
(14, 'a', NULL, 70, NULL, 'uploads/14-cover', 'uploads/14-thumbnail', 1),
(15, 'a', NULL, 4, NULL, 'src/server/uploads/15-cover', 'src/server/uploads/15-thumbnail', 1),
(16, 'a', NULL, 0, NULL, NULL, NULL, 1),
(17, '1', NULL, 1, NULL, NULL, NULL, 1),
(18, '1', NULL, 2, NULL, 'src/server/uploads/18-coverpng', 'src/server/uploads/18-thumbnailpng', 1),
(19, '1', NULL, 3, NULL, 'src/server/uploads/19-cover.png', 'src/server/uploads/19-thumbnail.png', 1),
(20, '1', NULL, 1, NULL, NULL, NULL, 1),
(21, 'aaa', NULL, 344, NULL, 'src/server/uploads/21-cover.png', NULL, 1),
(22, 'aaaaaa', NULL, 23423, NULL, 'src/server/uploads/22-cover.png', NULL, 1),
(23, 'a', NULL, 2, NULL, 'src/server/uploads/23-cover.png', 'src/server/uploads/23-thumbnail.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `event_admin`
--

DROP TABLE IF EXISTS `event_admin`;
CREATE TABLE IF NOT EXISTS `event_admin` (
  `id_event` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id_event`,`id_user`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `event_admin`
--

INSERT INTO `event_admin` (`id_event`, `id_user`) VALUES
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1);

-- --------------------------------------------------------

--
-- Table structure for table `event_group`
--

DROP TABLE IF EXISTS `event_group`;
CREATE TABLE IF NOT EXISTS `event_group` (
  `id_event` int(11) NOT NULL,
  `id_group` int(11) NOT NULL,
  PRIMARY KEY (`id_event`,`id_group`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `event_group`
--

INSERT INTO `event_group` (`id_event`, `id_group`) VALUES
(2, 1),
(3, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `event_type`
--

DROP TABLE IF EXISTS `event_type`;
CREATE TABLE IF NOT EXISTS `event_type` (
  `id_event_type` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id_event_type`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `event_type`
--

INSERT INTO `event_type` (`id_event_type`, `name`) VALUES
(1, 'Uno'),
(2, 'Dos');

-- --------------------------------------------------------

--
-- Table structure for table `event_type_event`
--

DROP TABLE IF EXISTS `event_type_event`;
CREATE TABLE IF NOT EXISTS `event_type_event` (
  `id_event_type` int(11) NOT NULL,
  `id_event` int(11) NOT NULL,
  PRIMARY KEY (`id_event_type`,`id_event`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `event_type_event`
--

INSERT INTO `event_type_event` (`id_event_type`, `id_event`) VALUES
(1, 2),
(1, 3),
(2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
CREATE TABLE IF NOT EXISTS `groups` (
  `id_group` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id_group`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id_group`, `name`) VALUES
(1, 'Administracion'),
(2, 'Normal');

-- --------------------------------------------------------

--
-- Table structure for table `participation`
--

DROP TABLE IF EXISTS `participation`;
CREATE TABLE IF NOT EXISTS `participation` (
  `id_participation` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_participation`),
  UNIQUE KEY `unique` (`id_event`,`id_user`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `participation`
--

INSERT INTO `participation` (`id_participation`, `id_event`, `id_user`, `active`) VALUES
(1, 3, 1, 1),
(2, 2, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(128) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `email`, `password`, `active`) VALUES
(1, 'usuario', 'e64cb91c7c1819bdcda4dca47a2aae98e737df75ddb0287083229dc0695064616df676a0c95ae55109fe0a27ba9dee79ea9a5c9d90cceb0cf8ae80b4f61ab4a3', 1),
(2, 'hola', 'da77bd2a1d857d88b31de27536b81df7f005027d4f847667df13a0569b6048e0454ce9480827789547cc174060c4f388866ebb0209929b0de414cc9ac571c421', 1),
(3, 'admin', 'e64cb91c7c1819bdcda4dca47a2aae98e737df75ddb0287083229dc0695064616df676a0c95ae55109fe0a27ba9dee79ea9a5c9d90cceb0cf8ae80b4f61ab4a3', 1),
(4, 'admin2', 'e64cb91c7c1819bdcda4dca47a2aae98e737df75ddb0287083229dc0695064616df676a0c95ae55109fe0a27ba9dee79ea9a5c9d90cceb0cf8ae80b4f61ab4a3', 1),
(5, 'admin3', 'e64cb91c7c1819bdcda4dca47a2aae98e737df75ddb0287083229dc0695064616df676a0c95ae55109fe0a27ba9dee79ea9a5c9d90cceb0cf8ae80b4f61ab4a3', 1),
(6, 'fdasfsdaf', 'e64cb91c7c1819bdcda4dca47a2aae98e737df75ddb0287083229dc0695064616df676a0c95ae55109fe0a27ba9dee79ea9a5c9d90cceb0cf8ae80b4f61ab4a3', 1),
(7, 'weqr', 'e64cb91c7c1819bdcda4dca47a2aae98e737df75ddb0287083229dc0695064616df676a0c95ae55109fe0a27ba9dee79ea9a5c9d90cceb0cf8ae80b4f61ab4a3', 1),
(8, '6445', '786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
CREATE TABLE IF NOT EXISTS `user_group` (
  `id_user` int(11) NOT NULL,
  `id_group` int(11) NOT NULL,
  PRIMARY KEY (`id_user`,`id_group`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_group`
--

INSERT INTO `user_group` (`id_user`, `id_group`) VALUES
(1, 1),
(1, 2);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
