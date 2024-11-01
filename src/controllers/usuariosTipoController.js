
import UsuariosTipoService from '../services/usuariosTipoService.js';

const usuariosTipoService = new UsuariosTipoService();
const createUsuarioTipo = async (req, res) => {
    try {
        const result = await usuariosTipoService.createUsuarioTipoService(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};
// Controlador para obtener todos los tipos de usuario
const getAllUsuariosTipo = async (req, res) => {
    try {
        const tipos = await usuariosTipoService.getAllUsuariosTipoService();
        res.status(200).json(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: error.message });
    }
};
// Controlador para actualizar un tipo de usuario
const updateUsuarioTipo = async (req, res) => {
    const { id } = req.params;
    const body = req.body; // Tomamos todo el cuerpo para la validación

    try {
        const result = await usuariosTipoService.updateUsuarioTipoService(id, body);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

// Controlador para dar de baja lógica a un tipo de usuario
const deleteUsuarioTipo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await usuariosTipoService.deleteUsuarioTipoService(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

const altaUsuarioTipo = async (req, res) => {
    const { id } = req.params; // Asegúrate de que el ID se pasa como parámetro
    try {
        const result = await usuariosTipoService.altaUsuarioTipoService(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};



export default {
    createUsuarioTipo,
    getAllUsuariosTipo,
    updateUsuarioTipo,
    deleteUsuarioTipo,
    altaUsuarioTipo,
};
