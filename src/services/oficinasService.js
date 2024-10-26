import OficinasDB from "../db/oficinasDB.js";
import { validarIdReclamoTipo, validarNombreOficinaExistente, validarCamposOficina, validarOficinaActiva, validarOficinaInactiva } from "../utils/validacionesOficinas.js";

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
  async crearOficinaService({ activo, idReclamoTipo, nombre }) {
    validarCamposOficina({ activo, idReclamoTipo, nombre });
    await validarNombreOficinaExistente(nombre);
    await validarIdReclamoTipo(idReclamoTipo);
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
  async updateOficinaService(id, cambios) {
    const { nombre, idReclamoTipo } = cambios;

    await validarOficinaActiva(id);

    // Validación del nombre: no puede estar vacío
    if (nombre !== undefined && nombre.trim() === "") {
      throw { status: 400, message: 'El nombre no puede estar vacío.' };
    }

    // Validación de longitud del nombre
    if (nombre && nombre.length > 20) {
      throw { status: 400, message: 'El nombre no puede exceder 20 caracteres.' };
    }

    if (nombre) {
      await validarNombreOficinaExistente(nombre);
    }

    if (idReclamoTipo) {
      await validarIdReclamoTipo(idReclamoTipo);
    }

    if (!nombre && !idReclamoTipo) {
      throw { status: 400, message: 'No se proporcionaron cambios para actualizar.' };
    }

    const result = await this.oficinasDB.updateOficinaDB(id, cambios);
    if (result.affectedRows === 0) {
      throw { status: 404, message: 'Oficina no encontrada.' };
    }

    return { mensaje: 'Oficina actualizada exitosamente.' };
  }
  async deleteOficinaService(id) {
    await validarOficinaActiva(id);
    await this.oficinasDB.bajaLogicaOficina(id);
    return { mensaje: 'Oficina eliminada exitosamente.' };
  }
  async reactivarOficinaService(id) {
    await validarOficinaInactiva(id);
    await this.oficinasDB.reactivarOficina(id);
    return { mensaje: 'Oficina reactivada exitosamente.' };
  }
}

export default OficinasService;