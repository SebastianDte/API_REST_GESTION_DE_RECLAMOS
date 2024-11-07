import { conexion } from './conexion.js';

class OficinasDB {
  async obtenerOficinas({ activo, nombre, page, pageSize }) {
    let query = `
        SELECT 
            oficinas.idOficina, 
            oficinas.nombre, 
            oficinas.activo, 
            IFNULL(reclamosTipo.descripcion, 'No especificado') AS tipoReclamo
        FROM 
            oficinas 
        LEFT JOIN 
            reclamosTipo ON oficinas.idReclamoTipo = reclamosTipo.idReclamoTipo
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

    query += ` LIMIT ?, ?`;
    values.push(offset, pageLimit);

    const [rows] = await conexion.query(query, values);
    return rows;
  }

  async crearOficina({ activo, idReclamoTipo, nombre }) {
    return await conexion.execute('INSERT INTO oficinas (activo, idReclamoTipo, nombre) VALUES (?, ?, ?)', [activo, idReclamoTipo, nombre]);
  }

  async obtenerOficinaPorId(id) {
    return await conexion.execute('SELECT * FROM oficinas WHERE idOficina = ? AND activo = 1', [id]);
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
    await conexion.execute('UPDATE oficinas SET activo = 0 WHERE idOficina = ?', [id]);
    // Desactivar las relaciones en usuariosOficinas
    await conexion.execute('UPDATE usuariosOficinas SET activo = 0 WHERE idOficina = ?', [id]);

  }
  async reactivarOficina(id) {
    return await conexion.execute('UPDATE oficinas SET activo = 1 WHERE idOficina = ?', [id]);
  }
}


export default OficinasDB;
