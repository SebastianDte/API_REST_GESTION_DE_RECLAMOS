// src/routes/usuarioRoutes.js
import express from 'express'; // Importar Express
import usuariosController from '../../controllers/usuariosController.js'; // Importar el controlador de usuarios

const router = express.Router(); 

// Ruta para crear un usuario.
router.post('/usuarios', usuariosController.createUsuario); 
//obtener todos los usuarios
router.get('/usuarios', usuariosController.getUsuarios);
// Ruta para obtener un usuario por ID
router.get('/usuarios/:id',usuariosController.getUsuarioPorId);
// // Ruta para actualizar un usuario
router.patch('/usuarios/:idUsuario', usuariosController.updateUsuario);



// // Ruta para eliminar un usuario | BAJA LÓGICA.
// router.delete('/usuarios/:idUsuario', usuariosController.deleteUsuario);
// // Ruta para reactivar un usuario
// router.patch('/usuarios/alta/:idUsuario', usuariosController.reactivarUsuario);

export default router; 
