import { conexion } from './conexion.js';

class UsuariosDB {
    async insertarUsuario(usuarioData) {
        const query = `
            INSERT INTO usuarios 
            (nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [
            usuarioData.nombre,
            usuarioData.apellido,
            usuarioData.correoElectronico,
            usuarioData.contrasenia,
            usuarioData.idTipoUsuario,
            usuarioData.imagen || null,
        ];

        await conexion.query(query, values);
        return usuarioData; 
    }

    // async obtenerUsuarios ({ activo, idTipoUsuario, nombre, apellido, page, pageSize }){
    //     // Construcción de la consulta base
    //     let query = `
    //       SELECT 
    //         usuarios.idUsuario, 
    //         usuarios.nombre, 
    //         usuarios.apellido, 
    //         usuarios.correoElectronico, 
    //         usuarios.contrasenia, 
    //         tipos.descripcion AS tipoUsuario, 
    //         usuarios.imagen, 
    //         usuarios.activo 
    //       FROM 
    //         usuarios 
    //       JOIN 
    //         usuariosTipo AS tipos 
    //       ON 
    //         usuarios.idTipoUsuario = tipos.idUsuarioTipo
    //     `;
      
    //     // Filtros
    //     const filters = [];
      
    //     if (activo !== undefined) {
    //       const activoBoolean = activo === 'true' ? 1 : 0;
    //       filters.push(`usuarios.activo = ${activoBoolean}`);
    //     }
      
    //     if (idTipoUsuario) {
    //       filters.push(`usuarios.idTipoUsuario = ${idTipoUsuario}`);
    //     }
      
    //     if (nombre) {
    //       filters.push(`usuarios.nombre LIKE '%${nombre}%'`);
    //     }
      
    //     if (apellido) {
    //       filters.push(`usuarios.apellido LIKE '%${apellido}%'`);
    //     }
      
    //     // Si hay filtros, agregarlos a la consulta
    //     if (filters.length > 0) {
    //       query += ` WHERE ${filters.join(' AND ')}`;
    //     }
      
    //     // Aplicar paginación solo si no hay filtros de nombre o apellido
    //     if (!nombre && !apellido) {
    //       const pageNum = parseInt(page, 10) || 1;
    //       const pageLimit = parseInt(pageSize, 10) || 10;
    //       const offset = (pageNum - 1) * pageLimit;
    //       query += ` LIMIT ${offset}, ${pageLimit}`;
    //     }
      
    //     const [rows] = await conexion.query(query);
    //     return rows;
    // };
    async obtenerUsuarios({ activo, idTipoUsuario, nombre, apellido, page, pageSize }) {
        // Construcción de la consulta base
        let query = `
          SELECT 
            usuarios.idUsuario, 
            usuarios.nombre, 
            usuarios.apellido, 
            usuarios.correoElectronico, 
            usuarios.contrasenia, 
            tipos.descripcion AS tipoUsuario, 
            usuarios.imagen, 
            usuarios.activo 
          FROM 
            usuarios 
          JOIN 
            usuariosTipo AS tipos 
          ON 
            usuarios.idTipoUsuario = tipos.idUsuarioTipo
        `;
    
        // Filtros y valores para la consulta
        const filters = [];
        const values = [];
    
        if (activo !== undefined) {
            const activoBoolean = activo === 'true' ? 1 : 0;
            filters.push(`usuarios.activo = ?`);
            values.push(activoBoolean);
        }
    
        if (idTipoUsuario) {
            filters.push(`usuarios.idTipoUsuario = ?`);
            values.push(idTipoUsuario);
        }
    
        if (nombre) {
            filters.push(`usuarios.nombre LIKE ?`);
            values.push(`%${nombre}%`);
        }
    
        if (apellido) {
            filters.push(`usuarios.apellido LIKE ?`);
            values.push(`%${apellido}%`);
        }
    
        // Si hay filtros, agregarlos a la consulta
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(' AND ')}`;
        }
    
        // Aplicar paginación solo si no hay filtros de nombre o apellido
        if (!nombre && !apellido) {
            const pageNum = parseInt(page, 10) || 1;
            const pageLimit = parseInt(pageSize, 10) || 10;
            const offset = (pageNum - 1) * pageLimit;
            query += ` LIMIT ?, ?`;
            values.push(offset, pageLimit); // Agregar valores para paginación
        }
    
        const [rows] = await conexion.query(query, values); // Usar parámetros
        return rows;
    }
    
    
}

export default UsuariosDB;
