import { conexion } from './conexion.js';

class UsuariosOficinasDB {
    async existeUsuario(idUsuario) {
        const [rows] = await conexion.query('SELECT 1 FROM usuarios WHERE idUsuario = ? AND activo = 1 LIMIT 1', [idUsuario]);
        return rows.length > 0;
    }

    async existeOficina(idOficina) {
        const [rows] = await conexion.query('SELECT 1 FROM oficinas WHERE idOficina = ? AND activo = 1 LIMIT 1', [idOficina]);
        return rows.length > 0;
    }

    async existeRelacion(idUsuario, idOficina) {
        const [rows] = await conexion.query(
            'SELECT 1 FROM usuariosOficinas WHERE idUsuario = ? AND idOficina = ? AND activo = true LIMIT 1',
            [idUsuario, idOficina]
        );
        return rows.length > 0;
    }

    async crearRelacion(idUsuario, idOficina) {
        const query = 'INSERT INTO usuariosOficinas (idUsuario, idOficina, activo) VALUES (?, ?, true)';
        const [result] = await conexion.query(query, [idUsuario, idOficina]);
        return result;
    }

    async obtenerTipoUsuario(idUsuario) {
        const [rows] = await conexion.query(
            'SELECT ut.descripcion FROM usuarios u JOIN usuariosTipo ut ON u.idTipoUsuario = ut.idUsuarioTipo WHERE u.idUsuario = ?',
            [idUsuario]
        );
        return rows.length > 0 ? rows[0].descripcion : null;
    }

    async listarRelaciones(idUsuario = null, idOficina = null) {
        let query = `
            SELECT 
                uo.idUsuarioOficina,
                uo.idUsuario, 
                u.nombre AS nombreUsuario, 
                u.apellido AS apellidoUsuario, 
                uo.idOficina, 
                o.nombre AS nombreOficina 
            FROM 
                usuariosoficinas uo 
            JOIN 
                usuarios u ON uo.idUsuario = u.idUsuario
            JOIN 
                oficinas o ON uo.idOficina = o.idOficina
            WHERE 
                uo.activo = 1
        `;
    
        const params = [];
    
        // Agregar condiciones para los filtros según si se proporcionan valores
        if (idUsuario) {
            query += ' AND uo.idUsuario = ?';
            params.push(idUsuario);
        }
        if (idOficina) {
            query += ' AND uo.idOficina = ?';
            params.push(idOficina);
        }
    
        const [rows] = await conexion.query(query, params);
        return rows;
    }

    async obtenerRelacionPorId(idUsuarioOficina) {
        const [rows] = await conexion.query(`
            SELECT 
                uo.idUsuarioOficina, 
                uo.idUsuario, 
                u.nombre AS nombreUsuario, 
                u.apellido AS apellidoUsuario, 
                uo.idOficina, 
                o.nombre AS nombreOficina 
            FROM 
                usuariosOficinas uo 
            JOIN 
                usuarios u ON uo.idUsuario = u.idUsuario
            JOIN 
                oficinas o ON uo.idOficina = o.idOficina
            WHERE 
                uo.idUsuarioOficina = ? AND uo.activo = 1
        `, [idUsuarioOficina]);
        return rows.length > 0 ? rows[0] : null; // Devuelve la relación si existe, o null si no
    }

    async actualizarRelacion(idUsuarioOficina, body) {
        const { idOficina, idUsuario } = body;

        const relacionExistente = await this.obtenerRelacionPorId(idUsuarioOficina);
        if (!relacionExistente) {
            throw new Error("Error: la relación no existe.");
        }

        const updatedIdOficina = idOficina || relacionExistente.idOficina;
        const updatedIdUsuario = idUsuario || relacionExistente.idUsuario;

        const query = `
            UPDATE usuariosOficinas 
            SET idUsuario = ?, idOficina = ?
            WHERE idUsuarioOficina = ?
        `;
        const [resultado] = await conexion.query(query, [updatedIdUsuario, updatedIdOficina, idUsuarioOficina]);

        if (resultado.affectedRows === 0) {
            throw new Error("No se pudo actualizar la relación, verifique los datos.");
        }

        return resultado;
    }

    async eliminarRelacion(id) {
        const [row] = await conexion.query('SELECT activo FROM usuariosOficinas WHERE idUsuarioOficina = ?', [id]);

        if (row.length === 0) {
            return null;
        }

        if (row[0].activo === 0) {
            return null;
        }

        const [resultado] = await conexion.query('UPDATE usuariosOficinas SET activo = 0 WHERE idUsuarioOficina = ?', [id]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return true;
    }

    async activarRelacion(id) {

        const [relacion] = await conexion.query('SELECT idUsuario, idOficina, activo FROM usuariosOficinas WHERE idUsuarioOficina = ?', [id]);


        if (relacion.length === 0) {
            throw new Error("Error: la relación no existe.");
        }


        if (relacion[0].activo) {
            throw new Error("Error: la relación ya está activa.");
        }

        const idUsuario = relacion[0].idUsuario;
        const idOficina = relacion[0].idOficina;

        // Validar que el usuario y la oficina están activos
        const [usuarioActivo] = await conexion.query('SELECT 1 FROM usuarios WHERE idUsuario = ? AND activo = 1 LIMIT 1', [idUsuario]);
        const [oficinaActiva] = await conexion.query('SELECT 1 FROM oficinas WHERE idOficina = ? AND activo = 1 LIMIT 1', [idOficina]);

        if (usuarioActivo.length === 0 || oficinaActiva.length === 0) {
            throw new Error("Error: el usuario o la oficina no están activos.");
        }


        await conexion.query('UPDATE usuariosOficinas SET activo = 1 WHERE idUsuarioOficina = ?', [id]);

        return { mensaje: "Relación activada correctamente." };
    }

}

export default new UsuariosOficinasDB();
