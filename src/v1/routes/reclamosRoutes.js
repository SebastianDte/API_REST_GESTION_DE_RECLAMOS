import express from 'express';
import passport from '../../middlewares/passport.js'; // Asegúrate de importar Passport
import reclamosController from '../../controllers/reclamosController.js';


const router = express.Router();


router.get(
    '/reclamos',
    passport.authenticate('jwt', { session: false }),  // Middleware de autenticación
    passport.authorize(1, 2, 3), // Middleware de autorización por rol
    reclamosController.obtenerReclamos  // Controlador para obtener los reclamos
);


router.post('/reclamos', reclamosController.crearReclamo);

// obtener un reclamo por ID
router.get('/reclamos/:id', reclamosController.obtenerReclamo);

// actualizar un reclamo
router.patch('/reclamos/:id', reclamosController.actualizarReclamo);


router.patch(
    '/reclamos/:id/baja', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    reclamosController.eliminarReclamo
);

router.patch(
    '/reclamos/:idReclamo/alta', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1), 
    reclamosController.reactivarReclamo
);


export default router;
