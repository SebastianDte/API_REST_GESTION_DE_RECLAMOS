import express from 'express';
import usuarioRoutes from './routes/usuariosRoutes.js'; 
import oficinasRoutes from './routes/oficinasRoutes.js';
const router = express.Router();

//Rutas
router.use(usuarioRoutes);
router.use(oficinasRoutes);

export default router; 
