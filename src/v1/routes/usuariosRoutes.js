// src/routes/usuarioRoutes.js
import express from 'express'; 
import usuariosController from '../../controllers/usuariosController.js'; 
import passport from '../../middlewares/passport.js'; 
import { verificarPropietario } from '../../middlewares/verificarPropietario.js'


const router = express.Router(); 

// Ruta para crear un usuario.
router.post('/usuarios', usuariosController.createUsuario); 

// // Ruta para actualizar un usuario
router.patch(
    '/usuarios/:idUsuario',
    passport.authenticate('jwt', { session: false }), 
    verificarPropietario, 
    usuariosController.updateUsuario 
);

// (solo Administrador)
router.get(
    '/usuarios', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    usuariosController.getUsuarios 
  );

  router.get(
    '/usuarios/:id',
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    usuariosController.getUsuarioPorId 
  );


// Ruta para reactivar un usuario (solo Administrador)
router.patch(
    '/usuarios/baja/:idUsuario',
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    usuariosController.deleteUsuario 
);

// Ruta para reactivar un usuario (solo Administrador)
router.patch(
    '/usuarios/alta/:idUsuario',
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    usuariosController.reactivarUsuario 
);

export default router; 
