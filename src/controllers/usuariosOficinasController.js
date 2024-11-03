import usuariosOficinasService from '../services/usuariosOficinasService.js';


const createUsuarioOficina = async (req, res) => {
    try {
        const { idUsuario, idOficina } = req.body; 
        const result = await usuariosOficinasService.crearRelacion(idUsuario, idOficina, req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

const getAllUsuariosOficina = async (req, res) => {
    const { idUsuario, idOficina } = req.query;
    try {
        const usuariosOficinas = await usuariosOficinasService.listarRelaciones(idUsuario || null, idOficina || null);
        res.status(200).json(usuariosOficinas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: error.message });
    }
};

const updateUsuarioOficina = async (req, res) => {
    try {
        const { id } = req.params; 
        const result = await usuariosOficinasService.actualizarRelacion(Number(id), req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

const deleteUsuarioOficina = async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await usuariosOficinasService.eliminarRelacion(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

const activarUsuarioOficina = async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await usuariosOficinasService.activarRelacion(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensaje: error.message });
    }
};

const getRelacionPorId = async (req, res) => {
    const { id } = req.params; 
    try {
        const relacion = await usuariosOficinasService.obtenerRelacionPorId(id);
        res.status(200).json(relacion);
    } catch (error) {
        console.error(error);
        res.status(404).json({ mensaje: error.message }); 
    }
};



export default {
    createUsuarioOficina,
    getAllUsuariosOficina,
    updateUsuarioOficina,
    deleteUsuarioOficina,
    activarUsuarioOficina,
    getRelacionPorId,
};