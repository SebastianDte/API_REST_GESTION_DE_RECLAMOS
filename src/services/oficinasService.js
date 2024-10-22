import OficinasDB from "../db/oficinasDB.js";
import { validarIdReclamoTipo, validarNombreOficinaExistente,validarCamposOficina,validarOficinaActiva } from "../utils/validacionesOficinas.js";

class OficinasService {
  constructor() {
    this.oficinasDB = new OficinasDB(); 
  }

  async obtenerOficinas(filtros) {
    try {
      const oficinas = await this.oficinasDB.obtenerOficinas(filtros);
      return oficinas;
    } catch (error) {
      throw new Error('Error al obtener las oficinas'); // Manejo de errores
    }
  }

  async crearOficinaService ({ activo, idReclamoTipo, nombre }){
    // Validar campos
    validarCamposOficina({ activo, idReclamoTipo, nombre });
  
    // Validar si ya existe una oficina con el mismo nombre
    await validarNombreOficinaExistente(nombre);
    // Validar si el idReclamoTipo existe
    await validarIdReclamoTipo(idReclamoTipo);
    // Insertar nueva oficina
    const result = await this.oficinasDB.crearOficina({ activo, idReclamoTipo, nombre });
    return { id: result.insertId, mensaje: 'Oficina creada exitosamente.' };
  };

  async obtenerOficinaPorId(id) {
    try {
        const [oficina] = await this.oficinasDB.obtenerOficinaPorId(id);
        if (oficina.length === 0) {
            throw { status: 404, message: 'Oficina no encontrada con el ID proporcionado.' };
        }
        return oficina[0];
    } catch (error) {
       
        if (error.status) {
            throw error; 
        }
        throw new Error('Error al obtener la oficina'); 
    }
  }


}

export default OficinasService;