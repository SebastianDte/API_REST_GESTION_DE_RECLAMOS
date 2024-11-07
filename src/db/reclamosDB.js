// reclamosDB.js
import { conexion } from './conexion.js';

class ReclamosDB {

    async obtenerReclamosPorUsuario(idUsuario) {
        try {
            // Consulta SQL para obtener los reclamos creados por este usuario
            const query = `
                SELECT 
                    asunto,
                    descripcion,
                    fechaCreado,
                     fechaCancelado,
                        fechaFinalizado,
                    (SELECT descripcion FROM ReclamosEstado WHERE idReclamoEstado = Reclamos.idReclamoEstado) AS estadoDescripcion,
                    (SELECT descripcion FROM ReclamosTipo WHERE idReclamoTipo = Reclamos.idReclamoTipo) AS tipoDescripcion
                FROM Reclamos
                WHERE idUsuarioCreador = ?;
                ;
            `;
            const [rows] = await conexion.query(query, [idUsuario]);
            return rows;
            //return result;  // Devolvemos los reclamos encontrados
        } catch (error) {
            console.error('Error al obtener reclamos en DB:', error);
            throw new Error('Error al obtener reclamos en DB');
        }
    }

    async obtenerTodosLosReclamos(filtros) {
        // Comienza con la consulta base
        let query = `
            SELECT r.*, 
                   e.descripcion AS estado, 
                   t.descripcion AS tipo, 
                   u.nombre AS nombreCreador, 
                   u.apellido AS apellidoCreador, 
                   uf.nombre AS nombreFinalizador, 
                   uf.apellido AS apellidoFinalizador 
            FROM reclamos r
            LEFT JOIN reclamosEstado e ON r.idReclamoEstado = e.idReclamoEstado
            LEFT JOIN reclamosTipo t ON r.idReclamoTipo = t.idReclamoTipo
            LEFT JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
            LEFT JOIN usuarios uf ON r.idUsuarioFinalizador = uf.idUsuario
            WHERE 1=1
        `;

        const params = [];

        // Aplicar filtros
        if (filtros.idReclamoEstado) {
            query += ' AND r.idReclamoEstado = ?';
            params.push(filtros.idReclamoEstado);
        }

        if (filtros.idReclamoTipo) {
            query += ' AND r.idReclamoTipo = ?';
            params.push(filtros.idReclamoTipo);
        }

        if (filtros.fechaCreacionInicio && filtros.fechaCreacionFin) {
            query += ' AND r.fechaCreado BETWEEN ? AND ?';
            params.push(filtros.fechaCreacionInicio, filtros.fechaCreacionFin);
        }

        if (filtros.fechaFinalizacionInicio && filtros.fechaFinalizacionFin) {
            query += ' AND r.fechaFinalizado BETWEEN ? AND ?';
            params.push(filtros.fechaFinalizacionInicio, filtros.fechaFinalizacionFin);
        }

        if (filtros.palabraClave) {
            query += ' AND (r.asunto LIKE ? OR r.descripcion LIKE ?)';
            params.push(`%${filtros.palabraClave}%`, `%${filtros.palabraClave}%`);
        }

        // Agregar paginado si es necesario
        const offset = (filtros.page - 1) * filtros.limit || 0;
        const limit = filtros.limit || 10; // valor por defecto
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [result] = await conexion.query(query, params);

        return result; // Devolvemos el resultado crudo para que el servicio lo transforme.
    }

    async obtenerReclamoPorId(idReclamo) {
        const query = `
            SELECT 
                r.idReclamo, 
                r.asunto, 
                r.descripcion, 
                r.fechaCreado, 
                r.fechaFinalizado, 
                r.fechaCancelado, 
                e.descripcion AS estado, 
                t.descripcion AS tipo, 
                u.nombre AS nombreCreador, 
                u.apellido AS apellidoCreador, 
                uf.nombre AS nombreFinalizador, 
                uf.apellido AS apellidoFinalizador
            FROM 
                reclamos r
            LEFT JOIN 
                reclamosEstado e ON r.idReclamoEstado = e.idReclamoEstado
            LEFT JOIN 
                reclamosTipo t ON r.idReclamoTipo = t.idReclamoTipo
            LEFT JOIN 
                usuarios u ON r.idUsuarioCreador = u.idUsuario
            LEFT JOIN 
                usuarios uf ON r.idUsuarioFinalizador = uf.idUsuario
            WHERE 
                r.idReclamo = ?`;

        const [result] = await conexion.query(query, [idReclamo]);
        return result[0];
    }


    async crearReclamo(reclamo) {
        const query = `
            INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoEstado, idReclamoTipo, idUsuarioCreador)
            VALUES (?, ?, NOW(), ?, ?, ?)
        `;

        const { asunto, descripcion, idReclamoEstado, idReclamoTipo, idUsuarioCreador } = reclamo;
        const [result] = await conexion.query(query, [asunto, descripcion, idReclamoEstado, idReclamoTipo, idUsuarioCreador]);
        return result.insertId;
    };

    async validarEstadoExiste(idReclamoEstado) {
        const query = `SELECT COUNT(*) as count FROM reclamosEstado WHERE idReclamoEstado = ?`;
        const [result] = await conexion.query(query, [idReclamoEstado]);
        return result[0].count > 0; // Retorna true si existe
    }

    async validarTipoExiste(idReclamoTipo) {
        const query = `SELECT COUNT(*) as count FROM reclamosTipo WHERE idReclamoTipo = ?`;
        const [result] = await conexion.query(query, [idReclamoTipo]);
        return result[0].count > 0; // Retorna true si existe
    }

    async validarUsuarioExiste(idUsuarioCreador) {
        const query = `SELECT COUNT(*) as count FROM usuarios WHERE idUsuario = ?`;
        const [result] = await conexion.query(query, [idUsuarioCreador]);
        return result[0].count > 0; // Retorna true si existe
    }


    async actualizarReclamo(idReclamo, datosActualizados) {
        const camposPermitidos = ['asunto', 'descripcion', 'idReclamoEstado', 'idReclamoTipo', 'fechaCancelado', 'fechaFinalizado'];
        const camposParaActualizar = Object.keys(datosActualizados).filter(campo => camposPermitidos.includes(campo));

        if (camposParaActualizar.length === 0) {
            throw new Error("No se enviaron campos válidos para actualizar.");
        }

        const setClause = camposParaActualizar.map(campo => `${campo} = ?`).join(', ');
        const valores = camposParaActualizar.map(campo => datosActualizados[campo]);

        const query = `
        UPDATE reclamos
        SET ${setClause}
        WHERE idReclamo = ?
    `;

        // Añadimos el ID del reclamo al final de los valores
        valores.push(idReclamo);

        const [result] = await conexion.query(query, valores);
        return result.affectedRows;
    }

    async eliminarReclamo(idReclamo) {
        const query = 'DELETE FROM reclamos WHERE idReclamo = ?';
        const [result] = await conexion.query(query, [idReclamo]);
        return result.affectedRows;
    }
}

export default new ReclamosDB();
