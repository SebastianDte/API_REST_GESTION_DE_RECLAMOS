import { conexion } from './conexion.js';

class OficinasDB {
  async obtenerOficinas({ activo, nombre, page, pageSize }) {
    let query = `
        SELECT 
        idOficina, 
        nombre, 
        activo, 
        idReclamoTipo
        FROM 
        oficinas
        
    `;
    const filters = [];
    const values = [];

    if (activo !== undefined) {
      const activoBoolean = activo === 'true' ? 1 : 0;
      filters.push(`oficinas.activo = ?`);
      values.push(activoBoolean);
    }

    if (nombre) {
      filters.push(`oficinas.nombre LIKE ?`);
      values.push(`%${nombre}%`);
    }

    if (filters.length > 0) {
      query += ` WHERE ${filters.join(' AND ')}`;
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageLimit = parseInt(pageSize, 10) || 10;
    const offset = (pageNum - 1) * pageLimit;

    // Cambiar el orden de los parámetros en LIMIT y OFFSET
    query += ` LIMIT ?, ?`;
    values.push(offset, pageLimit); // Agregar valores para paginación

    const [rows] = await conexion.query(query, [...values]); // Usar parámetros
    return rows;
  }

  async crearOficina({ activo, idReclamoTipo, nombre }) {
    return await conexion.execute('INSERT INTO oficinas (activo, idReclamoTipo, nombre) VALUES (?, ?, ?)', [activo, idReclamoTipo, nombre]);
  }

  async obtenerOficinaPorId(id) {
    return await conexion.execute('SELECT * FROM oficinas WHERE idOficina = ?', [id]);
  }

  async updateOficinaDB(id, cambios) {
    const setClause = Object.keys(cambios).map(key => `${key} = ?`).join(', ');
    const values = Object.values(cambios);
    if (values.length === 0) {
        throw { status: 400, message: 'No se proporcionaron cambios para actualizar.' };
    }

    return await conexion.execute(`UPDATE oficinas SET ${setClause} WHERE idOficina = ?`, [...values, id]);
  }
  async bajaLogicaOficina(id) {
    return await conexion.execute('UPDATE oficinas SET activo = 0 WHERE idOficina = ?', [id]);
  }
  async reactivarOficina(id) {
    return await conexion.execute('UPDATE oficinas SET activo = 1 WHERE idOficina = ?', [id]);
  }
}


export default OficinasDB;
