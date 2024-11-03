import express from 'express';
import UsuariosOficinasController from '../../controllers/usuariosOficinasController.js';

const router = express.Router();

router.post('/usuariosOficinas', UsuariosOficinasController.createUsuarioOficina);
router.get('/usuariosOficinas', UsuariosOficinasController.getAllUsuariosOficina);
router.get('/usuariosOficinas/:id', UsuariosOficinasController.getRelacionPorId);
router.patch('/usuariosOficinas/:id', UsuariosOficinasController.updateUsuarioOficina);
router.patch('/usuariosOficinas/baja/:id', UsuariosOficinasController.deleteUsuarioOficina);
router.patch('/usuariosOficinas/alta/:id', UsuariosOficinasController.activarUsuarioOficina);


export default router;
