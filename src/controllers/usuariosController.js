import { validarUsuario } from '../utils/validacionesUsuarios.js';
import UsuariosService from '../services/usuariosService.js';
// import { conexion } from '../db/conexion.js';

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

const getUsuarios = async (req, res) => {
    try {
      const { activo, idTipoUsuario, nombre, apellido, page, pageSize } = req.query;
      const usuarios = await usuariosService.obtenerUsuarios({ activo, idTipoUsuario, nombre, apellido, page, pageSize });
  
      if (usuarios.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron usuarios que coincidan con los criterios de búsqueda.' });
      }
  
      res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
  };

const getUsuarioPorId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const usuario = await usuariosService.obtenerUsuarioPorId(id);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener el usuario' });
    }
};

const updateUsuario = async (req, res) => {
  const { idUsuario } = req.params; 
  console.log(`ID del usuario a actualizar: ${idUsuario}`);
  const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen } = req.body;

  const errores = validarUsuario(req.body); 
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const resultado = await usuariosService.actualizarUsuarioService(idUsuario, { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen });
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
};







//Lógica para modificar un usuario.
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












// Controlador para baja lógica de un usuario
const deleteUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    // Verificar si el usuario existe y está activo
    const [usuario] = await conexion.query('SELECT activo FROM usuarios WHERE idUsuario = ?', [idUsuario]);

    if (usuario.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Si el usuario ya está inactivo (baja lógica)
    if (usuario[0].activo === 0) {
        return res.status(400).json({ mensaje: 'El usuario ya ha sido dado de baja' });
    }

    // Realizar la baja lógica
    await conexion.query('UPDATE usuarios SET activo = 0 WHERE idUsuario = ?', [idUsuario]);
    res.json({ mensaje: 'Usuario dado de baja correctamente' });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al dar de baja al usuario' });
}
};
//Controlador para activar un usuario.
const reactivarUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  try {
      // Verificar si el usuario existe y está inactivo
      const [usuario] = await conexion.query('SELECT activo FROM usuarios WHERE idUsuario = ?', [idUsuario]);

      if (usuario.length === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      // Si el usuario ya está activo
      if (usuario[0].activo === 1) {
          return res.status(400).json({ mensaje: 'El usuario ya está activo' });
      }

      // Reactivar el usuario
      await conexion.query('UPDATE usuarios SET activo = 1 WHERE idUsuario = ?', [idUsuario]);
      res.json({ mensaje: 'Usuario reactivado correctamente' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al reactivar al usuario' });
  }
};

export default {
  createUsuario,
  getUsuarios,
  getUsuarioPorId,
  updateUsuario,

};
