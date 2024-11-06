// reclamosControlador.js
import ReclamosServicio from '../services/reclamosService.js';
import {validarCamposPermitidosUpdate} from '../utils/validacionesReclamos.js'

const obtenerReclamos=async(req, res)=> {
    try {
        // Obtener filtros de los parámetros de la consulta (query params)
        const filtros = {
            idReclamoEstado: req.query.idReclamoEstado,
            idReclamoTipo: req.query.idReclamoTipo,
            fechaCreacionInicio: req.query.fechaCreacionInicio,
            fechaCreacionFin: req.query.fechaCreacionFin,
            fechaFinalizacionInicio: req.query.fechaFinalizacionInicio,
            fechaFinalizacionFin: req.query.fechaFinalizacionFin,
            palabraClave: req.query.palabraClave,
            page: req.query.page ? parseInt(req.query.page, 10) : 1, // Página por defecto 1
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 10 // Límite por defecto 10
        };

        // Obtener reclamos filtrados
        const reclamos = await ReclamosServicio.obtenerTodosLosReclamos(filtros);

        // Devolver respuesta exitosa con los reclamos
        res.status(200).json(reclamos);
    } catch (error) {
        console.error('Error al obtener reclamos:', error);
        res.status(500).json({ mensaje: 'Error al obtener reclamos' });
    }
}

const obtenerReclamo = async (req, res) => {
    try {
        const { id } = req.params;
        const reclamo = await ReclamosServicio.obtenerReclamo(id);
        if (reclamo) {
            res.status(200).json(reclamo);
        } else {
            res.status(404).json({ message: 'Reclamo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el reclamo', error });
    }
}

const crearReclamo = async(req, res) =>{
    try {
        const reclamo = req.body;

        // Llama al servicio que manejará la creación del reclamo, incluyendo las validaciones
        const nuevoReclamo = await ReclamosServicio.crearReclamo(reclamo);
        res.status(201).json(nuevoReclamo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const actualizarReclamo=async(req, res) =>{
    try {
        const id = req.params.id;
        const reclamoActualizado = req.body;

        // Validar que al menos un campo esté presente para actualizar
        if (Object.keys(reclamoActualizado).length === 0) {
            throw new Error("Debe proporcionar al menos un campo para actualizar.");
        }
 
        // Validar campos permitidos antes de llamar al servicio
        validarCamposPermitidosUpdate(reclamoActualizado);

        // Llamar al servicio para la lógica de actualización
        const resultado = await ReclamosServicio.actualizarReclamo(id, reclamoActualizado);

        if (resultado) {
            res.status(200).json({ message: "Reclamo actualizado exitosamente." });
        } else {
            res.status(404).json({ message: "No se encontró el reclamo a actualizar." });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const eliminarReclamo = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await ReclamosServicio.eliminarReclamo(id);
        if (resultado) {
            res.status(200).json({ message: 'Reclamo eliminado' });
        } else {
            res.status(404).json({ message: 'Reclamo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el reclamo', error });
    }
}

export default {
    obtenerReclamos,
    obtenerReclamo,
    crearReclamo,
    actualizarReclamo,
    eliminarReclamo,
};
