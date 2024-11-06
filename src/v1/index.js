import express from 'express';

import usuarioRoutes from './routes/usuariosRoutes.js'; 
import oficinasRoutes from './routes/oficinasRoutes.js';
import reclamosRoutes from './routes/reclamosRoutes.js';
import usuarioTipoRoutes from './routes/usuarioTipoRoutes.js';
import reclamosTipoRoutes from './routes/reclamosTipoRoutes.js'; 
import reclamosEstadoRoutes from './routes/reclamosEstadoRoutes.js'; 
import usuariosOficinasRoutes from './routes/usuariosOficinasRoutes.js'
import authRoutes from './routes/authRoutes.js'

const router = express.Router();

//Rutas
router.use(usuarioRoutes);
router.use(oficinasRoutes);
router.use(reclamosRoutes);
router.use(usuarioTipoRoutes);
router.use(reclamosTipoRoutes);
router.use(reclamosEstadoRoutes);
router.use(usuariosOficinasRoutes);
router.use(authRoutes);
export default router; 



