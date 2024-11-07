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

    async obtenerUsuarios({ activo, idTipoUsuario, nombre, apellido, page, pageSize, idOficina }) {
        // Construcción de la consulta base
        let query = `
            SELECT 
                usuarios.idUsuario, 
                usuarios.nombre, 
                usuarios.apellido, 
                usuarios.correoElectronico, 
                tipos.descripcion AS tipoUsuario, 
                usuarios.imagen, 
                usuarios.activo, 
                IFNULL(oficinas.nombre, 'No Asignado') AS NombreOficina  -- Mostrar 'No Asignado' si la oficina es NULL
            FROM 
                usuarios 
            JOIN 
                usuariosTipo AS tipos 
            ON 
                usuarios.idTipoUsuario = tipos.idUsuarioTipo
            LEFT JOIN
                usuariosOficinas ON usuarios.idUsuario = usuariosOficinas.idUsuario
            LEFT JOIN 
                oficinas ON usuariosOficinas.idOficina = oficinas.idOficina  
            WHERE 
                usuarios.idTipoUsuario = 2  
        `;

        const filters = [];
        const values = [];

        if (activo !== undefined) {
            const activoBoolean = activo === 'true' ? 1 : 0;
            filters.push(`usuarios.activo = ?`);
            values.push(activoBoolean);
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
            query += ` AND ${filters.join(' AND ')}`;
        }

        // Filtrar por oficina si se proporciona un idOficina
        if (idOficina !== undefined && idOficina !== null) {
            query += ` AND usuariosOficinas.idOficina = ?`;
            values.push(idOficina);
        }

        // paginación
        if (!nombre && !apellido) {
            const pageNum = parseInt(page, 10) || 1;
            const pageLimit = parseInt(pageSize, 10) || 10;
            const offset = (pageNum - 1) * pageLimit;
            query += ` LIMIT ?, ?`;
            values.push(offset, pageLimit);
        }

        // Ejecutar la consulta con los valores
        const [rows] = await conexion.query(query, values);
        return rows;
    }


    async actualizarUsuario(idUsuario, updates, values) {
        const query = `
            UPDATE usuarios 
            SET ${updates.join(', ')}
            WHERE idUsuario = ?
        `;
        // Agregar el ID al final de los valores
        values.push(idUsuario);

        // Ejecuta la consulta
        const [result] = await conexion.query(query, values);
        return result; 
    }

    async darBajaUsuario(idUsuario) {
        await conexion.query('UPDATE usuarios SET activo = 0 WHERE idUsuario = ?', [idUsuario]);
        await conexion.query('UPDATE usuariosOficinas SET activo = 0 WHERE idUsuario = ?', [idUsuario]);
    };

    async reactivarUsuario(idUsuario) {
        await conexion.query('UPDATE usuarios SET activo = 1 WHERE idUsuario = ?', [idUsuario]);
    };

    async obtenerUsuarioPorEmail(correoElectronico) {
        const [rows] = await conexion.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [correoElectronico]);
        return rows[0]; // Devuelve el primer usuario encontrado
    };

    async getUsuarioPorId(id) {
        // Construcción de la consulta base para obtener un usuario por su ID
        let query = `
            SELECT 
                usuarios.idUsuario, 
                usuarios.nombre, 
                usuarios.apellido, 
                usuarios.correoElectronico, 
                tipos.descripcion AS tipoUsuario, 
                usuarios.imagen, 
                usuarios.activo, 
                IFNULL(GROUP_CONCAT(oficinas.nombre SEPARATOR ', '), 'No Asignado') AS oficinaNombre  -- Concatenar las oficinas en un solo campo
            FROM 
                usuarios 
            JOIN 
                usuariosTipo AS tipos 
            ON 
                usuarios.idTipoUsuario = tipos.idUsuarioTipo
            LEFT JOIN
                usuariosOficinas ON usuarios.idUsuario = usuariosOficinas.idUsuario
            LEFT JOIN 
                oficinas ON usuariosOficinas.idOficina = oficinas.idOficina  -- Obtener la descripción de la oficina
            WHERE 
                usuarios.idTipoUsuario = 2  -- Filtrar siempre por empleados
                AND usuarios.idUsuario = ?  -- Filtrar por el ID del usuario
            GROUP BY 
                usuarios.idUsuario
        `;
    
        const [rows] = await conexion.query(query, [id]);
        return rows;
    }
    // Método para obtener un usuario por su ID
async obtenerUsuarioPorId(idUsuario) {
    try {
        // Realizamos la consulta para obtener el usuario por su ID
        const query = 'SELECT correoElectronico, nombre FROM usuarios WHERE idUsuario = ?';
        
        // Ejecutamos la consulta
        const [resultado] = await db.execute(query, [idUsuario]);
        
        // Verificamos si encontramos el usuario
        if (resultado.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        
        // Devolvemos el primer (y único) resultado
        return resultado[0];
    } catch (error) {
        console.error('Error al obtener el usuario:', error.message);
        throw new Error('Error al obtener el usuario');
    }
}


    

}

export default UsuariosDB;
