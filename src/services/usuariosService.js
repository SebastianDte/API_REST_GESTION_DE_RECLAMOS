import { validarCorreoExistente,existeUsuario } from "../utils/validacionesUsuarios.js";
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
    
  async actualizarUsuario(idUsuario, datos) {
    // Obtener el usuario actual para conservar los valores originales
    const usuarioExistente = await usuariosDB.obtenerUsuarioPorId(idUsuario);

    if (!usuarioExistente) {
        throw new Error('Usuario no encontrado');
    }

    const updates = [];
    const values = [];

    if (datos.nombre || datos.nombre === '') {
        updates.push('nombre = ?');
        values.push(datos.nombre || usuarioExistente.nombre);
    }
    if (datos.apellido || datos.apellido === '') {
        updates.push('apellido = ?');
        values.push(datos.apellido || usuarioExistente.apellido);
    }
    if (datos.correoElectronico || datos.correoElectronico === '') {
        updates.push('correoElectronico = ?');
        values.push(datos.correoElectronico || usuarioExistente.correoElectronico);
    }
    if (datos.contrasenia || datos.contrasenia === '') {
        updates.push('contrasenia = ?');
        values.push(datos.contrasenia || usuarioExistente.contrasenia);
    }
    if (datos.idTipoUsuario || datos.idTipoUsuario === 0) {
        updates.push('idTipoUsuario = ?');
        values.push(datos.idTipoUsuario || usuarioExistente.idTipoUsuario);
    }
    if (datos.imagen || datos.imagen === '') {
        updates.push('imagen = ?');
        values.push(datos.imagen || usuarioExistente.imagen);
    }

    if (updates.length === 0) {
        throw new Error('No se proporcionaron campos para actualizar.');
    }

    return await usuariosDB.actualizarUsuario(idUsuario, updates, values);
    };

    async eliminarUsuarioService (idUsuario){
        const usuario = await existeUsuario(idUsuario);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
    
        if (usuario.activo === 0) {
            throw new Error('El usuario ya ha sido dado de baja');
        }
    
        await usuariosDB.darBajaUsuario(idUsuario);
        return { mensaje: 'Usuario dado de baja correctamente' };
    };
 
}

export default UsuariosService;
