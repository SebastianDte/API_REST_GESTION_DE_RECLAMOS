import reclamosTipoService from '../services/reclamosTipoService.js';


const createReclamoTipo = async (req, res) => {
    try {
        const result = await reclamosTipoService.createReclamoTipoService(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

const getAllReclamosTipo = async (req, res) => {
    try {
        const tipos = await reclamosTipoService.getAllReclamosTipoService();
        res.status(200).json(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: error.message });
    }
};

const updateReclamoTipo = async (req, res) => {
    try {
        const result = await reclamosTipoService.updateReclamoTipoService(req.body, req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};


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

const altaReclamoTipo = async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await reclamosTipoService.altaReclamoTipoService(id);
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
    altaReclamoTipo,
};
