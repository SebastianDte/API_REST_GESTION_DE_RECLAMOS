import { validarCorreoExistente } from "../utils/validaciones.js";
import { insertarUsuario } from "../db/usuariosDB.js";

class UsuariosService {
    async crearUsuario(usuarioData) {
        const { correoElectronico } = usuarioData;

        // Validar si el correo electrónico ya está en uso
        const existeCorreo = await validarCorreoExistente(correoElectronico);
        if (existeCorreo) {
            throw { status: 400, message: 'El correo electrónico ya está en uso.' };
        }

        // Llamar a la capa de acceso a datos para insertar el nuevo usuario
        const nuevoUsuario = await insertarUsuario(usuarioData);
        return nuevoUsuario;
    }
}

export default UsuariosService;
