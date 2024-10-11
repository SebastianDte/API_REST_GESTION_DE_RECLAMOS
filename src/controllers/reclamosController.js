import { conexion } from '../db/conexion.js'; 

// Lógica para crear un reclamo.
const createReclamo = async (req, res) => {
    const { descripcion, idUsuario, idTipoReclamo } = req.body;

    try {
        const query = `
            INSERT INTO reclamos 
            (descripcion, idUsuario, idTipoReclamo) 
            VALUES (?, ?, ?)`;
        
        const values = [descripcion, idUsuario, idTipoReclamo];

        // Ejecutar la consulta
        await conexion.query(query, values); 

        res.status(201).json({ mensaje: 'Reclamo creado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el reclamo' });
    }
};

// Lógica para obtener todos los reclamos 
const getAllReclamos = async (req, res) => {
    try {
        const estado = req.query.estado; // Parámetro para filtrar por estado

        // Construcción de la consulta base
        let query = `
            SELECT 
                reclamos.idReclamo, 
                reclamos.descripcion, 
                reclamos.fechaCreacion, 
                reclamos.estado, 
                usuarios.nombre AS usuario
            FROM 
                reclamos 
            JOIN 
                usuarios ON reclamos.idUsuario = usuarios.idUsuario
        `;

        // Agregar condiciones de filtrado a la consulta
        const conditions = []; 

        // Filtrar por estado
        if (estado !== undefined) {
            conditions.push(`reclamos.estado = ?`);
        }

        // Si hay condiciones, agregar la cláusula WHERE
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND '); 
        }

        // Ejecutar la consulta
        const [rows] = await conexion.query(query, estado ? [estado] : []);
        
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron reclamos que coincidan con los criterios de búsqueda.', data: [] });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los reclamos' });
    }
};

const getReclamoPorId = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la solicitud

    // Verificar que id sea un número válido
    const reclamoId = parseInt(id);
    if (isNaN(reclamoId)) {
        return res.status(400).json({ mensaje: 'ID inválido' });
    }

    try {
        // Realizar la consulta a la base de datos
        const [rows] = await conexion.query(
            `SELECT 
                r.idReclamo, 
                r.descripcion, 
                r.fechaCreado, 
                re.descripcion AS estado, 
                u.nombre AS usuarioCreador,
                u.apellido AS apellidoCreador
             FROM 
                reclamos AS r
             JOIN 
                usuarios AS u ON r.idUsuarioCreador = u.idUsuario
             JOIN 
                reclamosEstado AS re ON r.idReclamoEstado = re.idReclamoEstado
             WHERE 
                r.idReclamo = ?`, 
            [reclamoId] // Pasar el ID como parámetro
        );

        // Comprobar si se encontró algún reclamo
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Reclamo no encontrado' });
        }

        // Enviar la respuesta con los datos del reclamo
        res.status(200).json(rows[0]);
    } catch (error) {
        // Manejo de errores
        console.error('Error en la consulta:', error);
        res.status(500).json({ mensaje: 'Error al obtener el reclamo' });
    }
};
// Lógica para modificar un reclamo
const updateReclamo = async (req, res) => {
    const { idReclamo } = req.params; 
    const { descripcion, estado, idTipoReclamo } = req.body;

    const updates = [];
    const values = [];

    if (descripcion) {
        updates.push('descripcion = ?');
        values.push(descripcion);
    }
    if (estado) {
        updates.push('estado = ?');
        values.push(estado);
    }
    if (idTipoReclamo) {
        updates.push('idTipoReclamo = ?');
        values.push(idTipoReclamo);
    }

    if (updates.length === 0) {
        return res.status(400).json({ mensaje: 'No se proporcionaron campos para actualizar.' });
    }

    values.push(idReclamo);

    try {
        const query = `
            UPDATE reclamos 
            SET ${updates.join(', ')}
            WHERE idReclamo = ?`;

        const [result] = await conexion.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Reclamo no encontrado' });
        }

        res.status(200).json({ mensaje: 'Reclamo actualizado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el reclamo' });
    }
};

// Lógica para eliminar un reclamo (baja lógica)
const deleteReclamo = async (req, res) => {
    const { idReclamo } = req.params;

    try {
        const [reclamo] = await conexion.query('SELECT estado FROM reclamos WHERE idReclamo = ?', [idReclamo]);

        if (reclamo.length === 0) {
            return res.status(404).json({ mensaje: 'Reclamo no encontrado' });
        }

        // Realizar la baja lógica
        await conexion.query('UPDATE reclamos SET estado = "inactivo" WHERE idReclamo = ?', [idReclamo]);
        res.status(200).json({ mensaje: 'Reclamo dado de baja correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al dar de baja al reclamo' });
    }
};

// Lógica para reactivar un reclamo
const reactivarReclamo = async (req, res) => {
    const { idReclamo } = req.params;

    try {
        const [reclamo] = await conexion.query('SELECT estado FROM reclamos WHERE idReclamo = ?', [idReclamo]);

        if (reclamo.length === 0) {
            return res.status(404).json({ mensaje: 'Reclamo no encontrado' });
        }

        // Reactivar el reclamo
        await conexion.query('UPDATE reclamos SET estado = "activo" WHERE idReclamo = ?', [idReclamo]);
        res.status(200).json({ mensaje: 'Reclamo reactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al reactivar el reclamo' });
    }
};

export default {
    createReclamo,
    getAllReclamos,
    getReclamoPorId,
    updateReclamo,
    deleteReclamo,
    reactivarReclamo,
};
