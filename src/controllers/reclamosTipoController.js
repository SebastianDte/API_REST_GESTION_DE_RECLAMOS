import reclamosTipoService from '../services/reclamosTipoService.js';

const createReclamoTipo = async (req, res) => {
    const { descripcion } = req.body;
    try {
        const result = await reclamosTipoService.createReclamoTipoService({ descripcion });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

// Controlador para obtener todos los tipos de reclamos
const getAllReclamosTipo = async (req, res) => {
    try {
        const tipos = await reclamosTipoService.getAllReclamosTipoService();
        res.status(200).json(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: error.message });
    }
};

// Controlador para actualizar un tipo de reclamo
const updateReclamoTipo = async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    try {
        const result = await reclamosTipoService.updateReclamoTipoService(id, { descripcion });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

// Controlador para dar de baja lógica a un tipo de reclamo
const deleteReclamoTipo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await reclamosTipoService.deleteReclamoTipoService(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

export default {
    createReclamoTipo,
    getAllReclamosTipo,
    updateReclamoTipo,
    deleteReclamoTipo,
};
