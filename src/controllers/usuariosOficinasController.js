import UsuariosOficinasService from '../services/usuariosOficinasService.js';

const usuariosOficinasService = new UsuariosOficinasService();

const crearRelacion = async (req, res) => {
    const { idUsuario, idOficina } = req.body;

    try {
        const existe = await usuariosOficinasService.validarExistencia(idUsuario, idOficina);
        if (!existe) {
            return res.status(404).json({ mensaje: 'Error: Usuario o Oficina no encontrado.' });
        }

        const nuevaRelacion = await usuariosOficinasService.crearRelacion(idUsuario, idOficina);
        res.status(201).json(nuevaRelacion);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const listarRelaciones = async (req, res) => {
    const { idUsuario, idOficina } = req.query;

    try {
        const relaciones = await usuariosOficinasService.listarRelaciones(idUsuario, idOficina);
        res.json(relaciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las relaciones.' });
    }
};

const actualizarRelacion = async (req, res) => {
    const { id } = req.params;
    const { idOficina, activo } = req.body;

    try {
        const relacionActualizada = await usuariosOficinasService.actualizarRelacion(id, idOficina, activo);
        res.json(relacionActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la relación.' });
    }
};

const eliminarRelacion = async (req, res) => {
    const { id } = req.params;

    try {
        await usuariosOficinasService.eliminarRelacion(id);
        res.json({ mensaje: 'Relación eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la relación.' });
    }
};

export default {
    crearRelacion,
    listarRelaciones,
    actualizarRelacion,
    eliminarRelacion,
};
