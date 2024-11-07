// reclamosControlador.js
import ReclamosServicio from '../services/reclamosService.js';
import { validarCamposPermitidosUpdate } from '../utils/validacionesReclamos.js'
import jwt from 'jsonwebtoken';

const obtenerReclamos = async (req, res) => {
    try {

        const token = req.cookies.token;
        let rol = null;
        let idUsuario = null;

       
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
            rol = decodedToken.idTipoUsuario;
            idUsuario = decodedToken.id;
            console.log('Rol del token:', rol,'idUsuario: ',idUsuario);
        }

        // Solo agregar el filtro por idUsuarioCreador si el rol es Cliente (rol 3)
        if (rol === 3) {  // Si es Cliente
            console.log("Cliente identificado, agregando filtro por idUsuarioCreador:", idUsuario);
            // Llamar al servicio para obtener los reclamos solo de este usuario
            const reclamos = await ReclamosServicio.obtenerReclamos(idUsuario);
            const reclamosFiltrados = reclamos.map(reclamo => {
                // Eliminar las fechas que son NULL
                if (!reclamo.fechaCancelado) delete reclamo.fechaCancelado;
                if (!reclamo.fechaFinalizado) delete reclamo.fechaFinalizado;
    
                return reclamo;
            });
            return res.status(200).json(reclamosFiltrados);
        }

        return res.status(400).json({ mensaje: "Rol no autorizado para acceder a los reclamos" });
    } catch (error) {
        console.error("Error al obtener los reclamos:", error);
        res.status(500).json({ mensaje: "Error al obtener los reclamos" });
    }
};



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

const crearReclamo = async (req, res) => {
    try {
        const reclamo = req.body;

        // Llama al servicio que manejará la creación del reclamo, incluyendo las validaciones
        const nuevoReclamo = await ReclamosServicio.crearReclamo(reclamo);
        res.status(201).json(nuevoReclamo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const actualizarReclamo = async (req, res) => {
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

const reactivarReclamo = async (req, res) => {

}

export default {
    obtenerReclamos,
    obtenerReclamo,
    crearReclamo,
    actualizarReclamo,
    eliminarReclamo,
    reactivarReclamo
};
