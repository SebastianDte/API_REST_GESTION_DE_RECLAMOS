import express from 'express';
import reclamosTipoController from '../../controllers/reclamosTipoController.js';
import passport from '../../middlewares/passport.js';

const router = express.Router();

// Solo un administrador puede acceder a estas rutas
router.post(
    '/reclamosTipo',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    reclamosTipoController.createReclamoTipo
);

router.get(
    '/reclamosTipo',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    reclamosTipoController.getAllReclamosTipo
);

router.patch(
    '/reclamosTipo/:id',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    reclamosTipoController.updateReclamoTipo
);

router.patch(
    '/reclamosTipo/baja/:id',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    reclamosTipoController.deleteReclamoTipo
);

router.patch(
    '/reclamosTipo/alta/:id',
    passport.authenticate('jwt', { session: false }),
    passport.authorize(1),
    reclamosTipoController.altaReclamoTipo
);

export default router;
