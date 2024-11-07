import express from 'express';
import usuariosTipoController from '../../controllers/usuariosTipoController.js';
import passport from '../../middlewares/passport.js';

const router = express.Router();

// Solo un administrador puede acceder a estas rutas
router.post(
    '/usuariosTipo',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    usuariosTipoController.createUsuarioTipo
);

router.get(
    '/usuariosTipo',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    usuariosTipoController.getAllUsuariosTipo
);

router.patch(
    '/usuariosTipo/:id',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    usuariosTipoController.updateUsuarioTipo
);

router.patch(
    '/usuariosTipo/baja/:id',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    usuariosTipoController.deleteUsuarioTipo
);

router.patch(
    '/usuariosTipo/alta/:id',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    usuariosTipoController.altaUsuarioTipo
);

export default router;
