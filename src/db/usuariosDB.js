import { conexion } from './conexion.js';


export const validarCorreoExistente = async (correoElectronico) => {
    const query = 'SELECT * FROM usuarios WHERE correoElectronico = ?';
    const [rows] = await conexion.query(query, [correoElectronico]);
    return rows.length > 0; // Si existe, devolverá true, si no, false
};

export const insertarUsuario = async (usuarioData) => {
    const query = `
        INSERT INTO usuarios 
        (nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [
        usuarioData.nombre,
        usuarioData.apellido,
        usuarioData.correoElectronico,
        usuarioData.contrasenia,
        usuarioData.idTipoUsuario,
        usuarioData.imagen || null,
    ];

    
    await conexion.query(query, values);
    return usuarioData; 
};
