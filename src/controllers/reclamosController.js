import { conexion } from "../db/conexion.js";

export const getEstadoReclamo = async (req, res) => {
    try {
        const idReclamoEstado = req.params.idReclamoEstado;
        const sql = 'select activo, descripcion from reclamosestado where idReclamoEstado = ?;';
        const [result] = await conexion.query(sql, [idReclamoEstado]);

        if (!result.length) {
            return res.status(400).json({
                message: "No se encontró el estado."
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno."
        });
    }
};
