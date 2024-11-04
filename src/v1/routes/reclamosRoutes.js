import express from 'express';
import passport from '../../middlewares/passport.js'; // Asegúrate de importar Passport
import reclamosController from '../../controllers/reclamosController.js';


const router = express.Router();


router.get(
    '/reclamos',
    passport.authenticate('jwt', { session: false }), // Sigue igual
    passport.authorize('Administrador', 'OtroTipo'), // Cambia aquí a las cadenas de tipo de usuario
    reclamosController.obtenerReclamos
);

// obtener todos los reclamos
router.post('/reclamos', reclamosController.crearReclamo);

// obtener un reclamo por ID
router.get('/reclamos/:id', reclamosController.obtenerReclamo);

// actualizar un reclamo
router.patch('/reclamos/:id', reclamosController.actualizarReclamo);

// eliminar un reclamo | BAJA LÓGICA.
router.patch('/reclamos/baja:id', reclamosController.eliminarReclamo);

// reactivar un reclamo
// router.patch('/reclamos/reactivar/:idReclamo', reclamosController.reactivarReclamo);



export default router;
