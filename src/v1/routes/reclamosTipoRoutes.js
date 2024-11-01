import reclamosTipoController from '../../controllers/reclamosTipoController.js';
import express from 'express'; 
const router = express.Router(); 


router.post('/reclamosTipo', reclamosTipoController.createReclamoTipo);
router.get('/reclamosTipo', reclamosTipoController.getAllReclamosTipo);
router.patch('/reclamosTipo/:id', reclamosTipoController.updateReclamoTipo);
router.patch('/reclamosTipo/baja/:id', reclamosTipoController.deleteReclamoTipo);
router.patch('/reclamosTipo/alta/:id', reclamosTipoController.altaReclamoTipo);


export default router;
