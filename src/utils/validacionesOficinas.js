import { conexion } from '../db/conexion.js';

// Validar si ya existe una oficina con el mismo nombre
export const validarNombreOficinaExistente = async (nombre) => {
  const [oficinaExistente] = await conexion.execute('SELECT * FROM oficinas WHERE nombre = ?', [nombre]);
  return oficinaExistente.length > 0;
};

// Validar si el idReclamoTipo es válido
export const validarIdReclamoTipo = async (idReclamoTipo) => {
  const [tiposReclamos] = await conexion.execute('SELECT * FROM reclamosTipo WHERE idReclamoTipo = ?', [idReclamoTipo]);
  return tiposReclamos.length > 0;
};

//Validar si la oficina esta activa o no.
export const validarOficinaEstado = async (conexion, idOficina, accion) => {
    const [oficina] = await conexion.execute('SELECT * FROM oficinas WHERE idOficina = ?', [idOficina]);
    if (oficina.length === 0) {
        throw new Error('Oficina no encontrada');
    }
    
    if (accion === 'alta' && oficina[0].activo === 1) {
        throw new Error('La oficina ya está activa.');
    }
    
    if (accion === 'baja' && oficina[0].activo === 0) {
        throw new Error('La oficina ya está dada de baja.');
    }
    
    return oficina[0]; 
};


