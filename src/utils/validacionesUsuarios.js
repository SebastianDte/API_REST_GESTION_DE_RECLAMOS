import { conexion } from '../db/conexion.js'; // Asegúrate de importar la conexión

export const validarUsuario = (usuario, esActualizacion = false) => {
    const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario } = usuario;
    const errores = [];

    // En el caso de actualización, solo validamos campos obligatorios
    if (!esActualizacion) {
        // Validar que todos los campos obligatorios estén presentes para creación
        if (!nombre || !apellido || !correoElectronico || !contrasenia || !idTipoUsuario) {
            errores.push('Todos los campos son obligatorios');
        }
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correoElectronico && !emailRegex.test(correoElectronico)) {
        errores.push('El correo electrónico no es válido');
    }

    // Validar longitud de la contraseña
    if (contrasenia && contrasenia.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres');
    }

     // Validar que el idTipoUsuario esté en el rango permitido
     const tiposPermitidos = [1, 2, 3];
     if (idTipoUsuario && !tiposPermitidos.includes(Number(idTipoUsuario))) {
         errores.push('El tipo de usuario es inválido. Debe ser 1, 2 o 3.');
     }

    return errores;
};
export const existeUsuario = async (idUsuario) => {
    const [rows] = await conexion.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario]);
    return rows.length > 0 ? rows[0] : null;  // Devuelve el primer usuario o null si no existe
};
//validar un correo existente
export const validarCorreoExistente = async (correoElectronico) => {
    const [rows] = await conexion.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [correoElectronico]);
    return rows.length > 0;
};

