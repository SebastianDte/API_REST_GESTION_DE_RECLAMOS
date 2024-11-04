import express from 'express';
import reclamosController from '../../controllers/reclamosController.js';

const router = express.Router();

// crear un reclamo.
router.get('/reclamos', reclamosController.obtenerReclamos); 

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
