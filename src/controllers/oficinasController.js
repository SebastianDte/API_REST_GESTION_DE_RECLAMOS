import { conexion } from '../db/conexion.js';
import { validarUsuario, validarCorreoExistente } from '../utils/validaciones.js';
import { validarNombreOficinaExistente,validarIdReclamoTipo,validarOficinaEstado} from '../utils/validacionesOficinas.js'

// Controlador para obtener todas las oficinas
const obtenerOficinas = async (req, res) => {
  try {
    const [oficinas] = await conexion.execute('SELECT * FROM oficinas');

    if (oficinas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron oficinas.' });
    }

    res.status(200).json(oficinas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las oficinas.' });
  }
};
// Controlador para crear una oficina
const createOficina = async (req, res) => {
    const { activo, idReclamoTipo, nombre } = req.body;
    try {
    // Validar si ya existe una oficina con el mismo nombre
    if (await validarNombreOficinaExistente(nombre)) {
      return res.status(400).json({ mensaje: 'Ya existe una oficina con este nombre.' });
    }

     // Validar si el idReclamoTipo existe
     if (!await validarIdReclamoTipo(idReclamoTipo)) {
      return res.status(400).json({ mensaje: 'idReclamoTipo no válido.' });
    }
      const result = await conexion.execute('INSERT INTO oficinas (activo, idReclamoTipo, nombre) VALUES (?, ?, ?)', [activo, idReclamoTipo, nombre]);
      res.status(201).json({ id: result[0].insertId, mensaje: 'Oficina creada exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear la oficina.' });
    }
  };
  // Controlador para obtener una oficina por ID
  const obtenerOficinaPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const [oficina] = await conexion.execute('SELECT * FROM oficinas WHERE idOficina = ?', [id]);
      if (oficina.length === 0) {
        return res.status(404).json({ mensaje: 'Oficina no encontrada.' });
      }
      res.status(200).json(oficina[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener la oficina.' });
    }
  };
  // Controlador para actualizar una oficina
  const updateOficina = async (req, res) => {
    const { id } = req.params;
    const { idReclamoTipo, nombre } = req.body;
    
    try {
        const cambios = {};
        
        // Verifica y agrega solo los campos que están presentes en el cuerpo de la solicitud
        if (nombre) {
            if (await validarNombreOficinaExistente(nombre)) {
                return res.status(400).json({ mensaje: 'Ya existe una oficina con este nombre.' });
            }
            cambios.nombre = nombre;
        }
        
        if (idReclamoTipo) {
            if (!await validarIdReclamoTipo(idReclamoTipo)) {
                return res.status(400).json({ mensaje: 'idReclamoTipo no válido.' });
            }
            cambios.idReclamoTipo = idReclamoTipo;
        }
        
        // Si no hay cambios, se puede devolver un mensaje o manejarlo según tu lógica
        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({ mensaje: 'No se proporcionaron cambios para actualizar.' });
        }
        
        // Construir la consulta SQL dinámica
        const setClause = Object.keys(cambios).map(key => `${key} = ?`).join(', ');
        const values = Object.values(cambios);
        
        const result = await conexion.execute(`UPDATE oficinas SET ${setClause} WHERE idOficina = ?`, [...values, id]);
        
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Oficina no encontrada.' });
        }
        
        res.status(200).json({ mensaje: 'Oficina actualizada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar la oficina.' });
    }
};
  // Controlador para eliminar una oficina (baja lógica)
  const deleteOficina = async (req, res) => {
    const { id } = req.params;
    try {
      const oficina = await validarOficinaEstado(conexion, id, 'baja');
      const result = await conexion.execute('UPDATE oficinas SET activo = 0 WHERE idOficina = ?', [id]);
      res.status(200).json({ mensaje: 'Oficina eliminada exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ mensaje: error.message });
    }
  };
  // Controlador para reactivar una oficina
const reactivarOficina = async (req, res) => {
  const { id } = req.params;
  try {
    const oficina = await validarOficinaEstado(conexion, id, 'alta'); 
    const result = await conexion.execute('UPDATE oficinas SET activo = 1 WHERE idOficina = ?', [id]);
    res.status(200).json({ mensaje: 'Oficina activada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ mensaje: error.message }); // Retorna el mensaje específico del error
  } 
};
  export default {
    createOficina,
    obtenerOficinas,
    obtenerOficinaPorId,
    updateOficina,
    deleteOficina,
    reactivarOficina,
  };
