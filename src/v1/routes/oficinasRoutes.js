import express from 'express'; 
import oficinasController from '../../controllers/oficinasController.js';

const router = express.Router(); 

// Ruta para crear una oficina.
router.post('/oficinas', oficinasController.createOficina); 

// Ruta para obtener todas las oficinas.
router.get('/oficinas', oficinasController.obtenerOficinas); 

// Ruta para obtener una oficina por ID.
router.get('/oficinas/:id', oficinasController.obtenerOficinaPorId); 

// Ruta para actualizar una oficina.
router.patch('/oficinas/:id', oficinasController.updateOficina); 

// Ruta para eliminar una oficina (baja lógica).
router.delete('/oficinas/:id', oficinasController.deleteOficina); 

// Ruta para reactivar una oficina.
router.patch('/oficinas/alta/:id', oficinasController.reactivarOficina); 

export default router; 
