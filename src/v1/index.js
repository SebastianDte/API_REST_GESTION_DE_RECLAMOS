import express from 'express';
import reclamosRouter from './routes/reclamosRoutes.js';  // Importa rutas de reclamos
import usuarioRoutes from './routes/usuariosRoutes.js';   // Importa rutas de usuarios

const router = express.Router();

//Rutas
router.use(reclamosRouter);
router.use(usuarioRoutes);

export default router;  // Exporta las rutas de la versión 1
