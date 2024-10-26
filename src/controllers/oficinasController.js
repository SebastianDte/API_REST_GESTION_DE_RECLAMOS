import {validarIdReclamoTipo,validarNombreOficinaExistente} from '../utils/validacionesOficinas.js'

import OficinasService from "../services/oficinasService.js";

const oficinasService = new OficinasService(); 
const obtenerOficinas = async (req, res) => {
  const { activo, nombre, page, pageSize } = req.query; // Extraemos parámetros de la consulta

  try {
    const oficinas = await oficinasService.obtenerOficinas({
      activo,
      nombre,
      page,
      pageSize,
    });

    if (oficinas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron oficinas.' });
    }

    res.status(200).json(oficinas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las oficinas.' });
  }
};
const createOficina = async (req, res) => {
  const { activo, idReclamoTipo, nombre } = req.body;

  try {
    // Llamar al servicio para crear la oficina
    const result = await oficinasService.crearOficinaService({ activo, idReclamoTipo, nombre });
    
    // Enviar la respuesta exitosa
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    // Manejar errores de validación o de base de datos
    res.status(error.status || 500).json({ mensaje: error.message || 'Error al crear la oficina.' });
  }
};
const obtenerOficinaPorId = async (req, res) => {
  const { id } = req.params;
  try {
      // Llamar al servicio para obtener la oficina por ID
      const oficina = await oficinasService.obtenerOficinaPorId(id);
      
      // Enviar la respuesta exitosa
      res.status(200).json(oficina);
  } catch (error) {
      console.error(error);
      // Manejar errores
      res.status(error.status || 500).json({ mensaje: error.message || 'Error al obtener la oficina.' });
  }
};

//falta agregar update de oficinas


//   // Controlador para eliminar una oficina (baja lógica)
//   const deleteOficina = async (req, res) => {
//     const { id } = req.params;
//     try {
//       const oficina = await validarOficinaEstado(conexion, id, 'baja');
//       const result = await conexion.execute('UPDATE oficinas SET activo = 0 WHERE idOficina = ?', [id]);
//       res.status(200).json({ mensaje: 'Oficina eliminada exitosamente.' });
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ mensaje: error.message });
//     }
//   };
//   // Controlador para reactivar una oficina
// const reactivarOficina = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const oficina = await validarOficinaEstado(conexion, id, 'alta'); 
//     const result = await conexion.execute('UPDATE oficinas SET activo = 1 WHERE idOficina = ?', [id]);
//     res.status(200).json({ mensaje: 'Oficina activada exitosamente.' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ mensaje: error.message }); // Retorna el mensaje específico del error
//   } 
// };
  export default {
    obtenerOficinas,
    createOficina,
    obtenerOficinaPorId,
  };
