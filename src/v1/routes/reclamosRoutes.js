import express from 'express';
import passport from '../../middlewares/passport.js'; // Asegúrate de importar Passport
import reclamosController from '../../controllers/reclamosController.js';


const router = express.Router();


router.get(
    '/reclamos',
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1, 2, 3), 
    reclamosController.obtenerReclamos  
);

router.post(
    '/reclamos',
    passport.authenticate('jwt', { session: false }),  // Verificar autenticación JWT
    passport.authorize(3),  // Solo clientes pueden crear reclamos
    reclamosController.crearReclamo  // Llamar al controlador de creación de reclamo
  );


router.get(
    '/reclamos/:id', 
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1, 2, 3), 
    reclamosController.obtenerReclamo);

// actualizar un reclamo
router.patch(
    '/reclamos/:id',
    passport.authenticate('jwt', { session: false }), 
    passport.authorize(1, 2, 3), 
    reclamosController.actualizarReclamo 
  );

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
