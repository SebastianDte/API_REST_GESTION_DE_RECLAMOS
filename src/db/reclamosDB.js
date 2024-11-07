// reclamosDB.js
import { conexion } from './conexion.js';

class ReclamosDB {

    async obtenerReclamosPorUsuario(idUsuario) {
        try {
            
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
    async obtenerReclamosPorOficinaParaEmpleado(idUsuario) {
        try {
            const query = `
                SELECT 
                    R.idReclamo,
                    R.asunto,
                    R.descripcion,
                    R.fechaCreado,
                    IFNULL(R.fechaCancelado, 'No especificado') AS fechaCancelado,
                    IFNULL(R.fechaFinalizado, 'No especificado') AS fechaFinalizado,
                    (SELECT descripcion FROM ReclamosEstado WHERE idReclamoEstado = R.idReclamoEstado) AS estadoDescripcion,
                    (SELECT descripcion FROM ReclamosTipo WHERE idReclamoTipo = R.idReclamoTipo) AS tipoDescripcion
                FROM Reclamos R
                WHERE R.idReclamoTipo = (
                    SELECT O.idReclamoTipo
                    FROM Oficinas O
                    INNER JOIN UsuariosOficinas UO ON UO.idOficina = O.idOficina
                    WHERE UO.idUsuario = 42 AND UO.activo = 1
                );
            `;

            const [rows] = await conexion.query(query, [idUsuario]);
            return rows;
        } catch (error) {
            console.error("Error al obtener reclamos para la oficina del empleado:", error);
            throw new Error("Error al obtener reclamos para la oficina del empleado");
        }
    }

    async obtenerTodosLosReclamos(filtros) {
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

        //filtros

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

        const offset = (parseInt(filtros.page) - 1) * parseInt(filtros.limit) || 0;
        const limit = parseInt(filtros.limit) || 10;

        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
        try {
            const [result] = await conexion.query(query, params);
            return result;
        } catch (error) {
            throw new Error('Error al obtener los reclamos: ' + error.message);
        }
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

    async obtenerReclamoPorIdUpdate(idReclamo) {
        const query = `
            SELECT 
    r.idReclamo, 
    r.asunto, 
    r.descripcion, 
    r.fechaCreado, 
    r.fechaFinalizado, 
    r.fechaCancelado, 
    e.descripcion AS estado, 
    t.idReclamoTipo,   -- Aquí se obtiene el ID del tipo de reclamo
    t.descripcion AS tipo,  -- La descripción del tipo de reclamo
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
    r.idReclamo = ?
`;

        const [result] = await conexion.query(query, [idReclamo]);
        return result[0];
    }



    async obtenerReclamoPorIdVal(id) {
        const query = "SELECT * FROM reclamos WHERE idReclamo = ?";
        const [rows] = await conexion.query(query, [id]);
        return rows[0];  // Devuelve el primer reclamo si lo encuentra
    };

    async crearReclamo(reclamo) {
        const query = `
            INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoEstado, idReclamoTipo, idUsuarioCreador)
            VALUES (?, ?, NOW(), 1, ?, ?);
        `;
        
        const { asunto, descripcion, idReclamoTipo, idUsuarioCreador } = reclamo;
        
        try {
            // Insertamos el reclamo
            const [result] = await conexion.query(query, [asunto, descripcion, idReclamoTipo, idUsuarioCreador]);
            
            // Obtenemos el ID del reclamo insertado
            const idReclamo = result.insertId;
    
            // Ahora que sabemos el ID insertado, podemos devolver toda la información del reclamo
            return {
                idReclamo,
                asunto,
                descripcion,
                fechaCreado: new Date(), // El valor de fechaCreado puede ser calculado en el servidor
                idReclamoEstado: 1,      // El estado por defecto es 1 (Creado)
                idReclamoTipo,
                idUsuarioCreador
            };
        } catch (error) {
            throw new Error("Error al crear el reclamo: " + error.message);  
        }
    }
    

    async validarEstadoExiste(idReclamoEstado) {
        const query = `SELECT COUNT(*) as count FROM reclamosEstado WHERE idReclamoEstado = ?`;
        const [result] = await conexion.query(query, [idReclamoEstado]);
        return result[0].count > 0; 
    }

    async validarTipoExiste(idReclamoTipo) {
        const query = `SELECT COUNT(*) as count FROM reclamosTipo WHERE idReclamoTipo = ?`;
        const [result] = await conexion.query(query, [idReclamoTipo]);
        return result[0].count > 0; 
    }

    async validarUsuarioExiste(idUsuarioCreador) {
        const query = `SELECT COUNT(*) as count FROM usuarios WHERE idUsuario = ?`;
        const [result] = await conexion.query(query, [idUsuarioCreador]);
        return result[0].count > 0; 
    }

    async actualizarReclamoCliente(idReclamo, datos) {
        const { idReclamoEstado } = datos;

        
        const query = `
            UPDATE reclamos
            SET idReclamoEstado = ?
            WHERE idReclamo = ?
        `;

       
        const [result] = await conexion.query(query, [idReclamoEstado, idReclamo]);

        
        if (result.affectedRows === 0) {
            throw new Error("El reclamo no se pudo actualizar.");
        }

       
        return { mensaje: "Reclamo actualizado exitosamente", resultado: { idReclamo, idReclamoEstado } };
    }

    async obtenerOficinaPorUsuario(idUsuario) {
        const query = `
            SELECT o.idOficina, o.nombre, o.idReclamoTipo
            FROM oficinas o
            INNER JOIN usuariosOficinas uo ON o.idOficina = uo.idOficina
            WHERE uo.idUsuario = ? AND uo.activo = 1;
        `;

        try {
            const [rows] = await conexion.query(query, [idUsuario]);

            if (rows.length === 0) {
                throw new Error("El usuario no tiene una oficina asignada o la relación no está activa.");
            }

            return rows[0];  
        } catch (error) {
            console.error("Error al obtener la oficina para el usuario:", error);
            throw error;
        }
    }


    async obtenerOficinaPorTipoReclamo(idReclamoTipo) {
        console.log("Buscando oficina para tipo de reclamo con ID:", idReclamoTipo);  
        const query = `
            SELECT o.idOficina, o.nombre, o.idReclamoTipo
            FROM oficinas o
            WHERE o.idReclamoTipo = ? AND o.activo = 1;
        `;

        try {
            const [rows] = await conexion.query(query, [idReclamoTipo]);

            if (rows.length === 0) {
                throw new Error("No se encontró ninguna oficina asociada al tipo de reclamo.");
            }

            return rows;  
        } catch (error) {
            console.error("Error al obtener la oficina para el tipo de reclamo:", error);
            throw error;
        }
    }


    async actualizarReclamoEmpleado(idReclamo, datosActualizados) {
        const { idReclamoEstado } = datosActualizados;

      
        const query = `
        UPDATE reclamos
        SET idReclamoEstado = ?
        WHERE idReclamo = ?
        AND idReclamoEstado != 4;  -- Asegura que el reclamo no esté en estado 'finalizado'
    `;

        try {
            const [resultado] = await conexion.query(query, [idReclamoEstado, idReclamo]);

           
            if (resultado.affectedRows === 0) {
                throw new Error("No se pudo actualizar el reclamo. Verifique si el estado es válido.");
            }

           
            return {
                idReclamo,
                idReclamoEstado,
            };

        } catch (error) {
            console.error("Error al actualizar el reclamo en la base de datos:", error);
            throw error;
        }
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
    
        // Añadir el ID del reclamo a los valores para la consulta
        valores.push(idReclamo);
    
        // Ejecutar la consulta
        const [result] = await conexion.query(query, valores);
        return result.affectedRows > 0;
    };
    

    async eliminarReclamo(idReclamo) {
        const query = 'DELETE FROM reclamos WHERE idReclamo = ?';
        const [result] = await conexion.query(query, [idReclamo]);
        return result.affectedRows;
    }
}

export default new ReclamosDB();
