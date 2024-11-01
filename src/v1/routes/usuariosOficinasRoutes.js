import express from 'express';
import UsuariosOficinasController from '../../controllers/usuariosOficinasController.js';

const router = express.Router();

router.post('/usuariosOficinas', UsuariosOficinasController.crearRelacion);
router.get('/usuariosOficinas', UsuariosOficinasController.listarRelaciones);
router.put('/usuariosOficinas/:id', UsuariosOficinasController.actualizarRelacion);
router.patch('/usuariosOficinas/baja/:id', UsuariosOficinasController.eliminarRelacion);

export default router;
