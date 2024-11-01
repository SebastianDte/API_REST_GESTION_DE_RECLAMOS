import reclamosEstadoDB from '../db/reclamosEstadoDB.js';

// Servicio para crear un estado de reclamo
const createReclamoEstadoService = async ({ descripcion }) => {
    const result = await reclamosEstadoDB.createReclamoEstado(descripcion);
    return { mensaje: 'Estado de reclamo creado exitosamente.', result };
};

// Servicio para obtener todos los estados de reclamos
const getAllReclamosEstadoService = async () => {
    return await reclamosEstadoDB.getAllReclamosEstado();
};

// Servicio para actualizar un estado de reclamo
const updateReclamoEstadoService = async (id, { descripcion }) => {
    await reclamosEstadoDB.updateReclamoEstado(id, { descripcion });
    return { mensaje: 'Estado de reclamo actualizado exitosamente.' };
};

// Servicio para dar de baja lógica a un estado de reclamo
const deleteReclamoEstadoService = async (id) => {
    await reclamosEstadoDB.bajaLogicaReclamoEstado(id);
    return { mensaje: 'Estado de reclamo dado de baja exitosamente.' };
};

export default {
    createReclamoEstadoService,
    getAllReclamosEstadoService,
    updateReclamoEstadoService,
    deleteReclamoEstadoService
};
