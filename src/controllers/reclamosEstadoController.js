import reclamosEstadoService from '../services/reclamosEstadoService.js';

const createReclamoEstado = async (req, res) => {
    const { descripcion } = req.body;
    try {
        const result = await reclamosEstadoService.createReclamoEstadoService({ descripcion });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

// Controlador para obtener todos los estados de reclamos
const getAllReclamosEstado = async (req, res) => {
    try {
        const estados = await reclamosEstadoService.getAllReclamosEstadoService();
        res.status(200).json(estados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: error.message });
    }
};

// Controlador para actualizar un estado de reclamo
const updateReclamoEstado = async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    try {
        const result = await reclamosEstadoService.updateReclamoEstadoService(id, { descripcion });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

// Controlador para dar de baja lógica a un estado de reclamo
const deleteReclamoEstado = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await reclamosEstadoService.deleteReclamoEstadoService(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

export default {
    createReclamoEstado,
    getAllReclamosEstado,
    updateReclamoEstado,
    deleteReclamoEstado,
};
