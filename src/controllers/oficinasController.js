import OficinasService from "../services/oficinasService.js";

const oficinasService = new OficinasService(); 

const obtenerOficinas = async (req, res) => {
  const { activo, nombre, page, pageSize } = req.query; 
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
    const result = await oficinasService.crearOficinaService({ activo, idReclamoTipo, nombre });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ mensaje: error.message || 'Error al crear la oficina.' });
  }
};
const obtenerOficinaPorId = async (req, res) => {
  const { id } = req.params;
  try {
      const oficina = await oficinasService.obtenerOficinaPorId(id);
      res.status(200).json(oficina);
  } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ mensaje: error.message || 'Error al obtener la oficina.' });
  }
};
const updateOficina = async (req, res) => {
  const { id } = req.params;
  const cambios = req.body; 

  try {
      const result = await oficinasService.updateOficinaService(id, cambios);
      res.status(200).json(result);
  } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ mensaje: error.message || 'Error al actualizar la oficina.' });
  }
};
const deleteOficina = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await oficinasService.deleteOficinaService(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).json({ mensaje: error.message || 'Error al eliminar la oficina.' });
  }
};
const reactivarOficina = async (req, res) => {
  const { id } = req.params;
  try {
    await oficinasService.reactivarOficinaService(id);
    res.status(200).json({ mensaje: 'Oficina activada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).json({ mensaje: error.message || 'Error al activar la oficina.' });
  } 
};
  export default {
    obtenerOficinas,
    createOficina,
    obtenerOficinaPorId,
    updateOficina,
    deleteOficina,
    reactivarOficina,
  };
