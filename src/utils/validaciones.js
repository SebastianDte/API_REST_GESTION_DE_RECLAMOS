import { conexion } from '../db/conexion.js'; // Asegúrate de importar la conexión



//Validar los datos para crear un usuario.
export const validarUsuario = (usuario) => {
    const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario } = usuario;
    const errores = [];

    if (!nombre || !apellido || !correoElectronico || !contrasenia || !idTipoUsuario) {
        errores.push('Todos los campos son obligatorios');
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoElectronico)) {
        errores.push('El correo electrónico no es válido');
    }

    // Validar longitud de la contraseña
    if (contrasenia.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres');
    }

    return errores;
};

//validar un correo existente
export const validarCorreoExistente = async (correoElectronico) => {
    const [rows] = await conexion.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [correoElectronico]);
    return rows.length > 0; // Devuelve true si el correo ya existe
};
