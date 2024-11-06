import { conexion } from '../db/conexion.js'; // Asegúrate de importar la conexión

export const validarUsuario = (usuario) => {
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = usuario; // Incluir la imagen en la desestructuración
    const errores = [];

    
        // Validar que todos los campos obligatorios estén presentes para creación
        if (!nombre || !apellido || !correoElectronico || !contrasenia) {
            errores.push('Todos los campos son obligatorios');
        }
    

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correoElectronico && !emailRegex.test(correoElectronico)) {
        errores.push('El correo electrónico no es válido');
    }

    // Validar longitud de la contraseña
    if (contrasenia) {
        const minLength = 6;
        const maxLength = 20; // Definir un límite máximo de longitud
        if (contrasenia.length < minLength || contrasenia.length > maxLength) {
            errores.push(`La contraseña debe tener entre ${minLength} y ${maxLength} caracteres`);
        }

        // Validar formato de la contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{6,20}$/;
        if (!passwordRegex.test(contrasenia)) {
            errores.push('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.');
        }
    }

    // Validar imagen
    if (!imagen) {
        // Asignar una imagen por defecto si no se proporciona
        usuario.imagen = 'https://i.imgur.com/YH0fchQ.png'; // Cambia esto por la ruta real de tu imagen por defecto
    } 

    return errores;
};

export const validaUsuarioUpdate = (usuario) => {
    const { correoElectronico, imagen } = usuario;
    const errores = [];

    // Validar formato de correo si se proporciona
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correoElectronico && !emailRegex.test(correoElectronico)) {
        errores.push('El correo electrónico no es válido');
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

