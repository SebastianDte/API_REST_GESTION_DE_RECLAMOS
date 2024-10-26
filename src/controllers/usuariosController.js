import { validarUsuario,validarCorreoExistente,existeUsuario } from '../utils/validacionesUsuarios.js';
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

  const { correoElectronico } = req.body;

  const errores = validarUsuario(req.body, true);  
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    const existe = await existeUsuario(idUsuario);
    if (!existe) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    if (correoElectronico) {
      const correoExistente = await validarCorreoExistente(correoElectronico);
      if (correoExistente) {
        return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso por otro usuario.' });
      }
    }
    const resultado = await usuariosService.actualizarUsuario(idUsuario, req.body);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
};

export const deleteUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  try {
      const resultado = await usuariosService.eliminarUsuario(idUsuario);
      res.json(resultado);
  } catch (error) {
      console.error(error);
      if (error.message === 'Usuario no encontrado') {
          return res.status(404).json({ mensaje: error.message });
      } else if (error.message === 'El usuario ya ha sido dado de baja') {
          return res.status(400).json({ mensaje: error.message });
      }
      res.status(500).json({ mensaje: 'Error al dar de baja al usuario' });
  }
};

export const reactivarUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  try {
      const resultado = await usuariosService.reactivarUsuario(idUsuario);
      res.json(resultado);
  } catch (error) {
      console.error(error);
      if (error.message === 'Usuario no encontrado') {
          return res.status(404).json({ mensaje: error.message });
      } else if (error.message === 'El usuario ya está activo') {
          return res.status(400).json({ mensaje: error.message });
      }
      res.status(500).json({ mensaje: 'Error al reactivar al usuario' });
  }
};

export default {
  createUsuario,
  getUsuarios,
  getUsuarioPorId,
  updateUsuario,
  deleteUsuario,
  reactivarUsuario,
};
