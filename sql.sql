-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando datos para la tabla datos.calificacion: ~5 rows (aproximadamente)
INSERT INTO `calificacion` (`id_calificacion`, `usuario`, `usuario_calificado`, `puntuacion`) VALUES
	(1, 1, 1, 4),
	(2, 2, 1, 4),
	(3, 1, 3, 4),
	(4, 1, 3, 5),
	(5, 1, 1, 4);

-- Volcando datos para la tabla datos.documento: ~1 rows (aproximadamente)
INSERT INTO `documento` (`id_documento`, `titulo`, `materia`, `universidad`, `semestre`, `url_archivo`, `tipo_documento`, `id_usuarios`) VALUES
	(1, 'arbol de probleas', 'estadistica', 'uniajc', '8', 'https://firebasestorage.googleapis.com/v0/b/react-proyecto-13dd8.appspot.com/o/documentos%2Fid%3A1%2Farbol%20de%20problema%20Bayron%20Cuetia.docx?alt=media&token=7205be8d-4aaa-4a0c-8fb0-45c916425fb3', 'taller', 1);

-- Volcando datos para la tabla datos.libro: ~1 rows (aproximadamente)
INSERT INTO `libro` (`id_libro`, `titulo`, `autor`, `materia`, `url_archivo`, `id_usuarios`) VALUES
	(1, 'algebra de baldor', 'baldor', 'matematica', 'https://firebasestorage.googleapis.com/v0/b/react-proyecto-13dd8.appspot.com/o/libros%2Fid%3A1%2F96-356-1-PB.pdf?alt=media&token=59c4117b-26cc-46eb-8048-8153864b6d99', 1);

-- Volcando datos para la tabla datos.preguntas: ~3 rows (aproximadamente)
INSERT INTO `preguntas` (`id_pregunta`, `texto`, `id_usuarios`, `materia`) VALUES
	(1, 'como sumar numero enteros', 1, 'matematica'),
	(3, 'como hallo la velocidad de un auto movil', 3, 'fisica'),
	(4, 'como calculo las combinaciones', 3, 'estadistica');

-- Volcando datos para la tabla datos.respuestas: ~2 rows (aproximadamente)
INSERT INTO `respuestas` (`id_respuesta`, `texto`, `id_usuarios`, `id_pregunta`) VALUES
	(1, 'se suma de la forma a+b=resultado', 2, 1),
	(2, 'se resuelve solo si se tiene la distancia y el tiempo por tanto d*t=V', 1, 3);

-- Volcando datos para la tabla datos.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuarios`, `nombre`, `edad`, `genero`, `correo`, `clave`, `url`) VALUES
	(1, 'Bayron', 20, '1', 'bayronmiguel158@gmail.com', 'bayron', 'https://firebasestorage.googleapis.com/v0/b/react-proyecto-13dd8.appspot.com/o/perfil%2Fid%3A1?alt=media&token=b9db53fc-2c43-4f19-ae60-2b34a9bb0914'),
	(2, 'carlos', 20, '1', 'carlos@gmail.com', 'carlos', 'https://firebasestorage.googleapis.com/v0/b/react-proyecto-13dd8.appspot.com/o/perfil%2Fid%3A2?alt=media&token=90188bc4-c85a-4b86-8f2d-e7e742dd748d'),
	(3, 'Ricardo Moztasa', 22, '1', 'ricardo@gmail.com', 'ricardo', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
