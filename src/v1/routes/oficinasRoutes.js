import express from 'express'; 
import oficinasController from '../../controllers/oficinasController.js';
import passport from '../../middlewares/passport.js'; 
const router = express.Router(); 

// Ruta para crear una oficina.
router.post(
    '/oficinas', 
    passport.authenticate('jwt', { session: false }), // Autenticación con JWT
    passport.authorize(1), // Solo los administradores (rol 1) pueden acceder
    oficinasController.createOficina
  ); 
  
  // Ruta para obtener todas las oficinas.
  router.get(
    '/oficinas', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), // Solo los administradores (rol 1) pueden acceder
    oficinasController.obtenerOficinas
  ); 
  
  // Ruta para obtener una oficina por ID.
  router.get(
    '/oficinas/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), // Solo los administradores (rol 1) pueden acceder
    oficinasController.obtenerOficinaPorId
  ); 
  
  // Ruta para actualizar una oficina.
  router.patch(
    '/oficinas/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), // Solo los administradores (rol 1) pueden acceder
    oficinasController.updateOficina
  );
  
  // Ruta para eliminar una oficina (baja lógica).
  router.patch(
    '/oficinas/baja/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), // Solo los administradores (rol 1) pueden acceder
    oficinasController.deleteOficina
  );
  
  // Ruta para reactivar una oficina.
  router.patch(
    '/oficinas/alta/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), // Solo los administradores (rol 1) pueden acceder
    oficinasController.reactivarOficina
  ); 

export default router; 
