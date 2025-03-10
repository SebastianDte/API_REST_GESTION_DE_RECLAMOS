import { validarUsuario, validarCorreoExistente, existeUsuario, validaUsuarioUpdate } from '../utils/validacionesUsuarios.js';
import UsuariosService from '../services/usuariosService.js';
import { sendEmail } from '../utils/enviarEmail.js';
import jwt from 'jsonwebtoken';



const usuariosService = new UsuariosService();

const createUsuario = async (req, res) => {
  const errores = validarUsuario(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  try {
    // Comprobar si hay un token en el encabezado de autorización
    const token = req.cookies.token;
    let rol = null;

    // validamos si hay un token
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
      rol = decodedToken.idTipoUsuario;  
      console.log('Rol del token:', rol);  
    }

    
    if (rol === 3) { 
      return res.status(403).json({ mensaje: 'No tienes permisos para crear usuarios.' });
    }

    
    if (rol === 1) { 
      req.body.idTipoUsuario = 2; // Asignar rol de empleado al nuevo usuario
    } else {
      // Si no está logueado o no es admin, le asgina rol de cliente (rol 3)
      req.body.idTipoUsuario = 3; // Crear nuevo usuario como cliente
    }

    const usuarioCreado = await usuariosService.crearUsuario(req.body);
    // Preparar datos para el correo
    const datosCorreo = {
      nombre: req.body.nombre, 
      correoElectronico:req.body.correoElectronico,
      year: new Date().getFullYear(),
    };

    if (req.body.idTipoUsuario === 2) {  // Si es un empleado
      await sendEmail(usuarioCreado.correoElectronico, datosCorreo, 'bienvenidaEmpleado');
    } else {  // Si es un cliente
      await sendEmail(usuarioCreado.correoElectronico, datosCorreo, 'bienvenidaCliente');
    }
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

  const errores = validaUsuarioUpdate(req.body, true);
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

const deleteUsuario = async (req, res) => {
  const { idUsuario } = req.params;
  let rol = null;

  try {
    // Obtener el token de las cookies
    const token = req.cookies.token;

    if (token) {
      // Decodificar el token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Usar la clave secreta
      rol = decodedToken.idTipoUsuario;  // Obtener el idTipoUsuario del token
      console.log('Rol del token:', rol);  // Verificar qué rol estás obteniendo
    }

    // Verificar si el rol es el adecuado (1 = Administrador)
    if (rol !== 1) {
      return res.status(403).json({ mensaje: 'No tienes permiso para dar de baja a este usuario' });
    }

    // Si el rol es Administrador, llamar al servicio para eliminar el usuario
    const usuario = await usuariosService.eliminarUsuario(idUsuario);
    return res.json(usuario);

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
