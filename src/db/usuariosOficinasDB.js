import { conexion } from './conexion.js';

class UsuariosOficinasDB {
    async existeUsuario(idUsuario) {
        const [rows] = await conexion.query('SELECT 1 FROM usuarios WHERE idUsuario = ? LIMIT 1', [idUsuario]);
        return rows.length > 0;
    }

    async existeOficina(idOficina) {
        const [rows] = await conexion.query('SELECT 1 FROM oficinas WHERE idOficina = ? LIMIT 1', [idOficina]);
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
        const [result] = await conexion.query(
            'INSERT INTO usuariosOficinas (idUsuario, idOficina, activo) VALUES (?, ?, true)',
            [idUsuario, idOficina]
        );
        return { idUsuarioOficina: result.insertId, idUsuario, idOficina, activo: true };
    }

    async listarRelaciones(idUsuario = null, idOficina = null) {
        let query = 'SELECT * FROM usuariosOficinas WHERE activo = true';
        const params = [];

        if (idUsuario) {
            query += ' AND idUsuario = ?';
            params.push(idUsuario);
        }
        if (idOficina) {
            query += ' AND idOficina = ?';
            params.push(idOficina);
        }

        const [rows] = await conexion.query(query, params);
        return rows;
    }

    async actualizarRelacion(id, idOficina, activo) {
        await conexion.query(
            'UPDATE usuariosOficinas SET idOficina = ?, activo = ? WHERE idUsuarioOficina = ?',
            [idOficina, activo, id]
        );
        return { idUsuarioOficina: id, idOficina, activo };
    }

    async eliminarRelacion(id) {
        await conexion.query('UPDATE usuariosOficinas SET activo = false WHERE idUsuarioOficina = ?', [id]);
    }
}

export default UsuariosOficinasDB;
