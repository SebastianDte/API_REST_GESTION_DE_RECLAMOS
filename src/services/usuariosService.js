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

    async obtenerUsuarioPorId (id){
        const usuario = await usuariosDB.obtenerUsuarioPorId(id);
        return usuario; 
    };

    async actualizarUsuarioService (idUsuario, datos){
        // Esto es para construir la consulta de actualización
        const updates = [];
        const values = [];
      
        if (datos.nombre) {
          updates.push('nombre = ?');
          values.push(datos.nombre);
        }
        if (datos.apellido) {
          updates.push('apellido = ?');
          values.push(datos.apellido);
        }
        if (datos.correoElectronico) {
          updates.push('correoElectronico = ?');
          values.push(datos.correoElectronico);
        }
        if (datos.contrasenia) {
          updates.push('contrasenia = ?');
          values.push(datos.contrasenia);
        }
        if (datos.idTipoUsuario) {
          updates.push('idTipoUsuario = ?');
          values.push(datos.idTipoUsuario);
        }
        if (datos.imagen) {
          updates.push('imagen = ?');
          values.push(datos.imagen);
        }
      
        // Si no hay campos para actualizar
        if (updates.length === 0) {
          throw new Error('No se proporcionaron campos para actualizar.');
        }
      
        // Agrega el ID del usuario al final de los valores
        values.push(idUsuario);
      
        return await usuariosDB.actualizarUsuario(updates, values);
      };
}

export default UsuariosService;
