import reclamosEstadoController from '../../controllers/reclamosEstadoController.js';
import express from 'express'; 
const router = express.Router(); 

router.post('/reclamosEstado', reclamosEstadoController.createReclamoEstado);
router.get('/reclamosEstado', reclamosEstadoController.getAllReclamosEstado);
router.patch('/reclamosEstado/:id', reclamosEstadoController.updateReclamoEstado);
router.patch('/reclamosEstado/baja/:id', reclamosEstadoController.deleteReclamoEstado);
router.patch('/reclamosEstado/alta/:id', reclamosEstadoController.activateReclamoEstado);

export default router;
