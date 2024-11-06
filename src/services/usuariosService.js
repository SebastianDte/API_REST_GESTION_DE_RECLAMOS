import { validarCorreoExistente, existeUsuario } from "../utils/validacionesUsuarios.js";
import UsuariosDB from "../db/usuariosDB.js";
import bcrypt from 'bcrypt';

const usuariosDB = new UsuariosDB();

class UsuariosService {


    async crearUsuario(usuarioData) {
        const { correoElectronico, contrasenia } = usuarioData;

        // Validar si el correo electrónico ya está en uso
        const existeCorreo = await validarCorreoExistente(correoElectronico);
        if (existeCorreo) {
            throw { status: 400, message: 'El correo electrónico ya está en uso.' };
        }

        // Encriptar la contraseña antes de guardarla
        const saltRounds = 10;
        usuarioData.contrasenia = await bcrypt.hash(contrasenia, saltRounds);

        // Llamar a la capa de acceso a datos para insertar el nuevo usuario
        const nuevoUsuario = await usuariosDB.insertarUsuario(usuarioData);
        return nuevoUsuario;
    }

    async obtenerUsuarios({ activo, idTipoUsuario, nombre, apellido, page, pageSize }) {
        // Construcción de la consulta
        const queryParams = { activo, idTipoUsuario, nombre, apellido, page, pageSize };
        return await usuariosDB.obtenerUsuarios(queryParams);
    }

    async obtenerUsuarioPorId(id) {
        const usuario = await usuariosDB.getUsuarioPorId(id);
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

        // Actualizar solo los campos permitidos
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
        if (datos.imagen) {
            updates.push('imagen = ?');
            values.push(datos.imagen);
        }

        if (updates.length === 0) {
            throw new Error('No se proporcionaron campos válidos para actualizar.');
        }

        return await usuariosDB.actualizarUsuario(idUsuario, updates, values);
    };

    async eliminarUsuario(idUsuario) {

        const usuario = await existeUsuario(idUsuario);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        if (usuario.idTipoUsuario !== 2) {
            throw new Error('No tienes permiso para dar de baja a este usuario');
        }
        if (usuario.activo === 0) {
            throw new Error('El usuario ya ha sido dado de baja');
        }

        await usuariosDB.darBajaUsuario(idUsuario);
        return { mensaje: 'Usuario dado de baja correctamente' };
    };

    async reactivarUsuario(idUsuario) {
        const usuario = await existeUsuario(idUsuario);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        if (usuario.idTipoUsuario !== 2) {
            throw new Error('No tienes permiso para dar de alta a este usuario');
        }

        if (usuario.activo === 1) {
            throw new Error('El usuario ya está activo');
        }

        await usuariosDB.reactivarUsuario(idUsuario);
        return { mensaje: 'Usuario reactivado correctamente' };
    };

}

export default UsuariosService;
