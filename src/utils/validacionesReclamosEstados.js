import reclamosEstadoDB from '../db/reclamosEstadoDB.js';

// Validar que la descripción no esté vacía
export const validarDescripcionNoVacia = (descripcion) => {
    if (!descripcion) {
        throw new Error('El cuerpo de la solicitud está vacío. Debe proporcionar una descripción.');
    }
};

// Validar que solo se pase la descripcion
export const validarSoloDescripcion = (data) => {
    const keys = Object.keys(data);
    if (keys.length !== 1 || keys[0] !== 'descripcion') {
        throw new Error('Solo se debe proporcionar la descripción.');
    }
};

// Verificar si la descripción ya existe
export const validarDescripcionUnica = async (descripcion, id = null) => {
    const existingReclamoEstado = await reclamosEstadoDB.findReclamoEstadoByDescripcion(descripcion);
    if (existingReclamoEstado && existingReclamoEstado.id !== id) {
        throw new Error('La descripción ya existe.');
    }
};
