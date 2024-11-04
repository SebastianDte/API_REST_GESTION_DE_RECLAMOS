import bcrypt from 'bcrypt';
import UsuarioDB from '../db/usuariosDB.js'; // Ajusta la ruta según tu estructura
import jwt from 'jsonwebtoken';

const usuarioDb = new UsuarioDB();

class AuthService {
    async login(correoElectronico, contrasenia) {
        const usuario = await usuarioDb.obtenerUsuarioPorEmail(correoElectronico);
        console.log('Email recibido:', correoElectronico);
        console.log('Contraseña recibida:', contrasenia);

        if (!usuario) {
            throw { status: 401, message: 'Credenciales inválidas' }; // Usuario no encontrado
        }

        if (usuario.activo === 0) {
            throw { status: 403, message: 'Usuario inactivo' }; // Usuario inactivo
        }

        // Compara las contraseñas
        // const isMatch = await bcrypt.compare(contrasenia, usuario.contrasenia);
        // if (!isMatch) {
        //     throw { status: 401, message: 'Credenciales inválidas' }; // Contraseña incorrecta
        // }
        // Compara las contraseñas directamente (solo para prueba)
        if (usuario.contrasenia !== contrasenia) {
            throw { status: 401, message: 'Credenciales inválidas' }; // Contraseña incorrecta
        }

        // Genera el token
        const token = jwt.sign({ id: usuario.idUsuario, idTipoUsuario: usuario.idTipoUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generado a las:', new Date().toUTCString());
        console.log('Token expira a las:', new Date(Date.now() + 3600000).toUTCString()); // 1 hora más tarde
        console.log(usuario);
        return token; // Devuelve el token
    };
}


export default new AuthService();