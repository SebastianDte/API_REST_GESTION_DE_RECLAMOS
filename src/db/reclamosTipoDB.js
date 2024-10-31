import { conexion } from './conexion.js';

// Función para crear un tipo de reclamo
const createReclamoTipo = async (descripcion) => {
    const [result] = await conexion.execute('INSERT INTO reclamosTipo (descripcion, activo) VALUES (?, ?)', [descripcion, 1]);
    return result;
};

// Función para obtener todos los tipos de reclamos
const getAllReclamosTipo = async () => {
    const [tipos] = await conexion.execute('SELECT * FROM reclamosTipo WHERE activo = 1');
    return tipos;
};

// Función para actualizar un tipo de reclamo
const updateReclamoTipo = async (id, { descripcion }) => {
    await conexion.execute('UPDATE reclamosTipo SET descripcion = ? WHERE idReclamoTipo = ?', [descripcion, id]);
};

// Función para dar de baja lógica a un tipo de reclamo
const bajaLogicaReclamoTipo = async (id) => {
    await conexion.execute('UPDATE reclamosTipo SET activo = 0 WHERE idReclamoTipo = ?', [id]);
};

export default {
    createReclamoTipo,
    getAllReclamosTipo,
    updateReclamoTipo,
    bajaLogicaReclamoTipo
};
