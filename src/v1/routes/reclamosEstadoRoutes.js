import reclamosEstadoController from '../../controllers/reclamosEstadoController.js';
import express from 'express'; 
import passport from '../../middlewares/passport.js';

const router = express.Router();

router.post(
    '/reclamosEstado', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    reclamosEstadoController.createReclamoEstado
);

router.get(
    '/reclamosEstado', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    reclamosEstadoController.getAllReclamosEstado
);

router.patch(
    '/reclamosEstado/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    reclamosEstadoController.updateReclamoEstado
);

router.patch(
    '/reclamosEstado/baja/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    reclamosEstadoController.deleteReclamoEstado
);

router.patch(
    '/reclamosEstado/alta/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    reclamosEstadoController.activateReclamoEstado
);

export default router;
