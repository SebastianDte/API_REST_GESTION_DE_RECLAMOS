import usuariosTipoController from '../../controllers/usuariosTipoController.js';
import express from 'express'; 
const router = express.Router(); 




router.post('/usuariosTipo', usuariosTipoController.createUsuarioTipo);
router.get('/usuariosTipo', usuariosTipoController.getAllUsuariosTipo);
router.patch('/usuariosTipo/:id', usuariosTipoController.updateUsuarioTipo);
router.patch('/usuariosTipo/baja/:id', usuariosTipoController.deleteUsuarioTipo);
router.patch('/usuariosTipo/alta/:id', usuariosTipoController.altaUsuarioTipo);

export default router;