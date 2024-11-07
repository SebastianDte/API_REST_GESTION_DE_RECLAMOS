// reclamosControlador.js
import ReclamosServicio from '../services/reclamosService.js';
import { validarCamposPermitidosUpdate,validarCamposPermitidosUpdateCliente } from '../utils/validacionesReclamos.js'
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
            console.log('Rol del token:', rol, 'idUsuario: ', idUsuario);
        }

        const reclamos = await ReclamosServicio.obtenerReclamos(idUsuario, rol,req);

        return res.status(200).json(reclamos);
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
        // Extraemos el token de las cookies
        const token = req.cookies.token;
        let idUsuario = null;

        if (token) {
            // Verificamos y decodificamos el token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            idUsuario = decodedToken.id;  // Extraemos el id del usuario desde el token
        }

        if (!idUsuario) {
            // Si no se encuentra el idUsuario en el token, respondemos con un error 401
            return res.status(401).json({ message: "No se ha proporcionado un token válido o el token no tiene un id de usuario." });
        }

        // Asignamos el id del usuario autenticado al reclamo
        const reclamo = req.body;
        reclamo.idUsuarioCreador = idUsuario;

        // Llamamos al servicio para manejar la creación del reclamo
        const nuevoReclamo = await ReclamosServicio.crearReclamo(reclamo);
        
        // Respondemos con el nuevo reclamo creado
        res.status(201).json(nuevoReclamo);
    } catch (error) {
        console.error("Error al crear el reclamo:", error);
        // Si hay un error, respondemos con el mensaje del error
        res.status(400).json({ message: error.message });
    }
};




export const actualizarReclamo = async (req, res) => {
    try {
       
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "No autorizado" });
        }

       
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const idUsuario = decodedToken.id;  
        const rol = decodedToken.idTipoUsuario;  

        console.log('Rol del token:', rol, 'idUsuario:', idUsuario);

        
        const id = req.params.id;  
        const datosActualizados = req.body; 

        if (rol === 3) { 
            const resultado = await ReclamosServicio.actualizarReclamoCliente(id, idUsuario, datosActualizados);
            return res.status(200).json({ mensaje: "Reclamo actualizado exitosamente", resultado });
        }else if(rol == 2){
            const resultado = await ReclamosServicio.actualizarReclamoEmpleado(id, idUsuario, datosActualizados);
            return res.status(200).json({ mensaje: "Reclamo actualizado exitosamente", resultado });
        }else if (rol === 1) {  
            const resultado = await ReclamosServicio.actualizarReclamoAdmin(id, datosActualizados);
            return res.status(200).json({ mensaje: "Reclamo actualizado exitosamente", resultado });
        }
        
        else {
            return res.status(403).json({ error: "No tienes permisos para actualizar este reclamo." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
    }
};

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
