import { conexion } from './conexion.js';

class OficinasDB {
  async obtenerOficinas({ activo, nombre, page, pageSize }) {
        // Construcción de la consulta base
        let query = `
          SELECT 
            oficinas.idOficina, 
            oficinas.nombre, 
            oficinas.activo 
          FROM 
            oficinas
        `;
      
        // Filtros y valores para la consulta
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
      
        // Si hay filtros, agregarlos a la consulta
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(' AND ')}`;
        }
      
        // Aplicar paginación
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

  
}


export default OficinasDB;
