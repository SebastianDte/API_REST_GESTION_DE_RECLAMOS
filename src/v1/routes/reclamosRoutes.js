import express from 'express';
import reclamosController from '../../controllers/reclamosController.js';

const router = express.Router();

// crear un reclamo.
router.post('/reclamos', reclamosController.createReclamo); 

// obtener todos los reclamos
router.get('/reclamos', reclamosController.getAllReclamos);

// obtener un reclamo por ID
router.get('/reclamos/:idReclamo', reclamosController.getReclamoPorId);

// actualizar un reclamo
router.patch('/reclamos/:idReclamo', reclamosController.updateReclamo);

// eliminar un reclamo | BAJA LÓGICA.
router.delete('/reclamos/:idReclamo', reclamosController.deleteReclamo);

// reactivar un reclamo
router.patch('/reclamos/reactivar/:idReclamo', reclamosController.reactivarReclamo);



export default router;
