

import ReclamosTipoDB from "../db/reclamosTipoDB.js";
const reclamosTipoDB = new ReclamosTipoDB();

export const validarReclamoTipo = async (descripcion) => {
    // 1. Validación de campo vacío
    if (!descripcion || descripcion.trim() === "") {
        throw new Error("La descripción del tipo de reclamo no puede estar vacía.");
    }
    
    // 2. Validación de duplicados
    const reclamoExistente = await reclamosTipoDB.buscarPorDescripcion(descripcion);
    if (reclamoExistente) {
        throw new Error("Ya existe un tipo de reclamo con esta descripción.");
    }

    return true; 
};
