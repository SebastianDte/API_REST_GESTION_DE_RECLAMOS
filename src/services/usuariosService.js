import { validarCorreoExistente } from "../utils/validacionesUsuarios.js";
import UsuariosDB from "../db/usuariosDB.js";

const usuariosDB = new UsuariosDB();

class UsuariosService {
    async crearUsuario(usuarioData) {
        const { correoElectronico } = usuarioData;

        // Validar si el correo electrónico ya está en uso
        const existeCorreo = await validarCorreoExistente(correoElectronico);
        if (existeCorreo) {
            throw { status: 400, message: 'El correo electrónico ya está en uso.' };
        }

        // Llamar a la capa de acceso a datos para insertar el nuevo usuario
        const nuevoUsuario = await usuariosDB.insertarUsuario(usuarioData);
        return nuevoUsuario;
    }

     async obtenerUsuarios({ activo, idTipoUsuario, nombre, apellido, page, pageSize }) {
        // Construcción de la consulta
        const queryParams = { activo, idTipoUsuario, nombre, apellido, page, pageSize };
        return await usuariosDB.obtenerUsuarios(queryParams);
      }
}

export default UsuariosService;
