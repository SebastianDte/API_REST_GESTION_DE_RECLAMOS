import reclamosEstadoService from '../services/reclamosEstadoService.js';

const createReclamoEstado = async (req, res) => {
    try {
        const result = await reclamosEstadoService.createReclamoEstadoService(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

const getAllReclamosEstado = async (req, res) => {
    try {
        const estados = await reclamosEstadoService.getAllReclamosEstadoService();
        res.status(200).json(estados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: error.message });
    }
};

const updateReclamoEstado = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await reclamosEstadoService.updateReclamoEstadoService(id, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

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

const activateReclamoEstado = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await reclamosEstadoService.activateReclamoEstadoService(id);
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
    activateReclamoEstado,
};
