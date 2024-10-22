import { conexion } from '../db/conexion.js';

// Validar si ya existe una oficina con el mismo nombre
export const validarNombreOficinaExistente = async (nombre) => {
  const [oficinaExistente] = await conexion.execute('SELECT * FROM oficinas WHERE nombre = ?', [nombre]);
  if (oficinaExistente.length > 0) {
    throw { status: 400, message: 'Ya existe una oficina con este nombre.' };
  }
};

// Validar si el idReclamoTipo es válido
export const validarIdReclamoTipo = async (idReclamoTipo) => {
  const [tiposReclamos] = await conexion.execute('SELECT * FROM reclamosTipo WHERE idReclamoTipo = ?', [idReclamoTipo]);
  if (tiposReclamos.length === 0) {
    throw { status: 400, message: 'idReclamoTipo no válido.' };
  }
};

// Validar si la oficina está activa o no
export const validarOficinaEstado = async (idOficina, accion) => {
  const [oficina] = await conexion.execute('SELECT * FROM oficinas WHERE idOficina = ?', [idOficina]);
  
  if (oficina.length === 0) {
    throw { status: 404, message: 'Oficina no encontrada.' };
  }
  
  if (accion === 'alta' && oficina[0].activo === 1) {
    throw { status: 400, message: 'La oficina ya está activa.' };
  }
  
  if (accion === 'baja' && oficina[0].activo === 0) {
    throw { status: 400, message: 'La oficina ya está dada de baja.' };
  }
  
  return oficina[0]; 
};
export const validarCamposOficina = ({ activo, idReclamoTipo, nombre }) => {
  // Validar campos requeridos
  if (!nombre || (activo !== 0 && activo !== 1) || !idReclamoTipo) {
    throw { status: 400, message: 'Campos requeridos: activo (0 o 1), idReclamoTipo y nombre (string).' };
  }

  // Validar longitud del nombre
  if (nombre.length > 100) {
    throw { status: 400, message: 'El nombre no puede exceder los 100 caracteres.' };
  }
}

export const validarOficinaActiva = async (id) => {
  const [oficina] = await conexion.execute('SELECT * FROM oficinas WHERE idOficina = ?', [id]);

  // Verificamos si la oficina existe
  if (oficina.length === 0) {
    throw { status: 404, message: 'Oficina no encontrada.' };
  }
  
  // Verificamos si la oficina está activa
  if (!oficina[0].activo) {
    throw { status: 400, message: 'La oficina está dada de baja y no se puede modificar.' };
  }
};
