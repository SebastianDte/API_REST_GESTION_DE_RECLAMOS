// src/routes/usuarioRoutes.js
import express from 'express'; // Importar Express
import usuariosController from '../../controllers/usuariosContronller.js'; // Importar el controlador de usuarios

const router = express.Router(); // Crear una instancia del router

// Definir la ruta para crear un usuario
router.post('/usuarios', usuariosController.createUsuario); // Usar el método del controlador
// obtener todos los usuarios
router.get('/usuarios', usuariosController.getAllUsuarios);
// Ruta para obtener usuarios con paginación
router.get('/usuarios/paginated', usuariosController.getPaginatedUsuarios);
// Ruta para actualizar un usuario
router.patch('/usuarios/:idUsuario', usuariosController.updateUsuario);

export default router; // Exportar las rutas
