import reclamosTipoDB from '../db/reclamosTipoDB.js';

// Servicio para crear un tipo de reclamo
const createReclamoTipoService = async ({ descripcion }) => {
    const result = await reclamosTipoDB.createReclamoTipo(descripcion);
    return { mensaje: 'Tipo de reclamo creado exitosamente.', result };
};

// Servicio para obtener todos los tipos de reclamos
const getAllReclamosTipoService = async () => {
    return await reclamosTipoDB.getAllReclamosTipo();
};

// Servicio para actualizar un tipo de reclamo
const updateReclamoTipoService = async (id, { descripcion }) => {
    await reclamosTipoDB.updateReclamoTipo(id, { descripcion });
    return { mensaje: 'Tipo de reclamo actualizado exitosamente.' };
};

// Servicio para dar de baja lógica a un tipo de reclamo
const deleteReclamoTipoService = async (id) => {
    await reclamosTipoDB.bajaLogicaReclamoTipo(id);
    return { mensaje: 'Tipo de reclamo dado de baja exitosamente.' };
};

export default {
    createReclamoTipoService,
    getAllReclamosTipoService,
    updateReclamoTipoService,
    deleteReclamoTipoService
};
