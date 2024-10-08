import express from 'express';
import { getEstadoReclamo } from '../../controllers/reclamosController.js';

const router = express.Router();

router.get('/reclamos-estados/:idReclamoEstado', getEstadoReclamo);

export default router;
