import express from 'express';
import usuarioRoutes from './routes/usuariosRoutes.js'; 
import oficinasRoutes from './routes/oficinasRoutes.js';
import reclamosRoutes from './routes/reclamosRoutes.js';
const router = express.Router();

//Rutas
router.use(usuarioRoutes);
router.use(oficinasRoutes);
router.use(reclamosRoutes);

export default router; 
