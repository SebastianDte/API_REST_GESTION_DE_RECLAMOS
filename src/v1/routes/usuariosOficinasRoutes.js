import express from 'express';
import UsuariosOficinasController from '../../controllers/usuariosOficinasController.js';
import passport from '../../middlewares/passport.js'; 

const router = express.Router();

// Solo un administrador puede acceder a estas rutas
router.post(
    '/usuariosOficinas', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    UsuariosOficinasController.createUsuarioOficina
);

router.get(
    '/usuariosOficinas', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    UsuariosOficinasController.getAllUsuariosOficina
);

router.get(
    '/usuariosOficinas/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    UsuariosOficinasController.getRelacionPorId
);

router.patch(
    '/usuariosOficinas/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    UsuariosOficinasController.updateUsuarioOficina
);

router.patch(
    '/usuariosOficinas/baja/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    UsuariosOficinasController.deleteUsuarioOficina
);

router.patch(
    '/usuariosOficinas/alta/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    UsuariosOficinasController.activarUsuarioOficina
);

export default router;
