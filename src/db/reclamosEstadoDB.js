import { conexion } from './conexion.js';

// Función para crear un estado de reclamo
const createReclamoEstado = async (descripcion) => {
    const [result] = await conexion.execute('INSERT INTO reclamosEstado (descripcion, activo) VALUES (?, ?)', [descripcion, 1]);
    return result;
};

// Función para obtener todos los estados de reclamos
const getAllReclamosEstado = async () => {
    const [estados] = await conexion.execute('SELECT * FROM reclamosEstado WHERE activo = 1');
    return estados;
};

// Función para actualizar un estado de reclamo
const updateReclamoEstado = async (id, { descripcion }) => {
    await conexion.execute('UPDATE reclamosEstado SET descripcion = ? WHERE idReclamoEstado = ?', [descripcion, id]);
};

// Función para dar de baja lógica a un estado de reclamo
const bajaLogicaReclamoEstado = async (id) => {
    await conexion.execute('UPDATE reclamosEstado SET activo = 0 WHERE idReclamoEstado = ?', [id]);
};

export default {
    createReclamoEstado,
    getAllReclamosEstado,
    updateReclamoEstado,
    bajaLogicaReclamoEstado
};
