import { validarUsuario } from '../utils/validaciones.js';
import UsuariosService from '../services/usuariosService.js';


const usuariosService = new UsuariosService();

const createUsuario = async (req, res) => {
    const errores = validarUsuario(req.body);
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const usuarioCreado = await usuariosService.crearUsuario(req.body);
        res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: usuarioCreado });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};
// Falta agregar permisos.
// Lógica para obtener todos los usuarios con opción de filtrado
// const getAllUsuarios = async (req, res) => {
//   try {
//     // Obtener parámetros de consulta para filtrado
//     const activo = req.query.activo; // Parámetro para filtrar por estado activo (true o false)
//     const idTipoUsuario = req.query.idTipoUsuario; // Parámetro para filtrar por tipo de usuario

//     // Construcción de la consulta base
//     let query = `
//       SELECT 
//         usuarios.idUsuario, 
//         usuarios.nombre, 
//         usuarios.apellido, 
//         usuarios.correoElectronico, 
//         usuarios.contrasenia, 
//         tipos.descripcion AS tipoUsuario, 
//         usuarios.imagen, 
//         usuarios.activo 
//       FROM 
//         usuarios 
//       JOIN 
//         usuariosTipo AS tipos 
//       ON 
//         usuarios.idTipoUsuario = tipos.idUsuarioTipo
//     `;

//     // Agregar condiciones de filtrado a la consulta
//     const conditions = []; // Arreglo para guardar condiciones de filtrado

//     // Filtrar por estado activo
//     if (activo !== undefined) {
//       // Asegurarse de que 'activo' sea un booleano válido
//       const activoBoolean = activo === 'true' ? 1 : 0; // Convertir 'true' a 1 y 'false' a 0
//       conditions.push(`usuarios.activo = ${activoBoolean}`); // Agregar condición para usuarios activos
//     }

//     // Filtrar por tipo de usuario
//     if (idTipoUsuario !== undefined) {
//       conditions.push(`usuarios.idTipoUsuario = ${idTipoUsuario}`); // Agregar condición para tipo de usuario
//     }

//     // Si hay condiciones, agregar la cláusula WHERE
//     if (conditions.length > 0) {
//       query += ' WHERE ' + conditions.join(' AND '); // Combina las condiciones con AND
//     }

//     // Ejecutar la consulta
//     const [rows] = await conexion.query(query);
//     // Verificar si se encontraron usuarios
//     if (rows.length === 0) {
//       return res.status(404).json({ mensaje: 'No se encontraron usuarios que coincidan con los criterios de búsqueda.' });
//     }
//     res.status(200).json(rows); // Retornar los resultados
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
//   }
// };
// // Lógica para obtener un usuario por ID
// const getUsuarioPorId = async (req, res) => {
//   const { id } = req.params; // Obtenemos el ID del parámetro de ruta

//   try {
//     // Consulta SQL para obtener el usuario por ID
//     const [rows] = await conexion.query(
//       `SELECT usuarios.idUsuario, 
//               usuarios.nombre, 
//               usuarios.apellido, 
//               usuarios.correoElectronico, 
//               usuarios.contrasenia, 
//               tipos.descripcion AS tipoUsuario, 
//               usuarios.imagen, 
//               usuarios.activo 
//        FROM usuarios 
//        JOIN usuariosTipo AS tipos ON usuarios.idTipoUsuario = tipos.idUsuarioTipo 
//        WHERE usuarios.idUsuario = ?`, 
//        [id] // Usamos ? para prevenir inyecciones SQL
//     );

//     // Verificamos si se encontró el usuario
//     if (rows.length === 0) {
//       return res.status(404).json({ mensaje: 'Usuario no encontrado' });
//     }

//     // Retornamos el usuario encontrado
//     res.status(200).json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ mensaje: 'Error al obtener el usuario' });
//   }
// };
// // Lógica para obtener usuarios con paginación y opción de filtrado
// const getPaginatedUsuarios = async (req, res) => {
//   const page = parseInt(req.query.page) || 1; //número de página
//   const pageSize = parseInt(req.query.pageSize) || 10; //tamaño de la página

//   // consulta base
//   let queryBase = `
//     SELECT 
//       usuarios.idUsuario, 
//       usuarios.nombre, 
//       usuarios.apellido, 
//       usuarios.correoElectronico, 
//       usuarios.contrasenia, 
//       tipos.descripcion AS tipoUsuario, 
//       usuarios.imagen, 
//       usuarios.activo 
//     FROM 
//       usuarios 
//     JOIN 
//       usuariosTipo AS tipos 
//     ON 
//       usuarios.idTipoUsuario = tipos.idUsuarioTipo
//   `;

//   // array para los filtros
//   const filters = [];

//   // comprueba si se envía el parámetro 'activo' para filtrar usuarios activos/inactivos
//   if (req.query.activo !== undefined) {
//     const activo = req.query.activo === 'true' ? 1 : 0; // Lo convierte a 1 o 0
//     filters.push(`usuarios.activo = ${activo}`);
//   }

//   // comprueba si se envía el parámetro 'idTipoUsuario' para filtrar por tipo de usuario
//   if (req.query.idTipoUsuario) {
//     filters.push(`usuarios.idTipoUsuario = ${req.query.idTipoUsuario}`);
//   }

//   // Si hay filtros, agregarlos a la consulta
//   if (filters.length > 0) {
//     queryBase += ` WHERE ${filters.join(' AND ')}`;
//   }

//   // Agregar la lógica de paginación
//   queryBase += ` LIMIT ${(page - 1) * pageSize}, ${pageSize}`;

//   try {
//     const paginatedResult = await paginarResultados(queryBase, page, pageSize, conexion);
//     // comprueba si hay resultados
//     if (paginatedResult.length === 0) {
//       return res.status(404).json({ mensaje: 'No se encontraron usuarios que coincidan con los criterios de búsqueda.' });
//     }
//     res.status(200).json(paginatedResult);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
//   }
// };
// //Lógica para modificar un usuario.
// const updateUsuario = async (req, res) => {
//   const { idUsuario } = req.params; 
//   console.log(`ID del usuario a actualizar: ${idUsuario}`);
//   const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen } = req.body;
 
//   const errores = validarUsuario(req.body); 
//   if (errores.length > 0) {
//     return res.status(400).json({ errores });
//   }

//   // Esto es para Construir la consulta de actualización
//   const updates = [];
//   const values = [];

//   if (nombre) {
//     updates.push('nombre = ?');
//     values.push(nombre);
//   }
//   if (apellido) {
//     updates.push('apellido = ?');
//     values.push(apellido);
//   }
//   if (correoElectronico) {
//     updates.push('correoElectronico = ?');
//     values.push(correoElectronico);
//   }
//   if (contrasenia) {
//     updates.push('contrasenia = ?');
//     values.push(contrasenia);
//   }
//   if (idTipoUsuario) {
//     updates.push('idTipoUsuario = ?');
//     values.push(idTipoUsuario);
//   }
//   if (imagen) {
//     updates.push('imagen = ?');
//     values.push(imagen);
//   }

//   // Si no hay campos para actualizar
//   if (updates.length === 0) {
//     return res.status(400).json({ mensaje: 'No se proporcionaron campos para actualizar.' });
//   }

//   // Esto Agrega el ID del usuario al final de los valores
//   values.push(idUsuario);

//   try {
//     const query = `
//       UPDATE usuarios 
//       SET ${updates.join(', ')}
//       WHERE idUsuario = ?
//     `;

//     const [result] = await conexion.query(query, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ mensaje: 'Usuario no encontrado' });
//     }

//     res.status(200).json({ mensaje: 'Usuario actualizado con éxito' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
//   }
// };
// // Controlador para baja lógica de un usuario
// const deleteUsuario = async (req, res) => {
//   const { idUsuario } = req.params;

//   try {
//     // Verificar si el usuario existe y está activo
//     const [usuario] = await conexion.query('SELECT activo FROM usuarios WHERE idUsuario = ?', [idUsuario]);

//     if (usuario.length === 0) {
//         return res.status(404).json({ mensaje: 'Usuario no encontrado' });
//     }

//     // Si el usuario ya está inactivo (baja lógica)
//     if (usuario[0].activo === 0) {
//         return res.status(400).json({ mensaje: 'El usuario ya ha sido dado de baja' });
//     }

//     // Realizar la baja lógica
//     await conexion.query('UPDATE usuarios SET activo = 0 WHERE idUsuario = ?', [idUsuario]);
//     res.json({ mensaje: 'Usuario dado de baja correctamente' });

    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ mensaje: 'Error al dar de baja al usuario' });
// }
// };
// //Controlador para activar un usuario.
// const reactivarUsuario = async (req, res) => {
//   const { idUsuario } = req.params;

//   try {
//       // Verificar si el usuario existe y está inactivo
//       const [usuario] = await conexion.query('SELECT activo FROM usuarios WHERE idUsuario = ?', [idUsuario]);

//       if (usuario.length === 0) {
//           return res.status(404).json({ mensaje: 'Usuario no encontrado' });
//       }

//       // Si el usuario ya está activo
//       if (usuario[0].activo === 1) {
//           return res.status(400).json({ mensaje: 'El usuario ya está activo' });
//       }

//       // Reactivar el usuario
//       await conexion.query('UPDATE usuarios SET activo = 1 WHERE idUsuario = ?', [idUsuario]);
//       res.json({ mensaje: 'Usuario reactivado correctamente' });

//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ mensaje: 'Error al reactivar al usuario' });
//   }
// };

export default {
  createUsuario,
};
