// src/controllers/usuariosController.js
import { conexion } from '../db/conexion.js'; // Importamos la conexión a la base de datos
import { validarUsuario,validarCorreoExistente } from '../utils/validaciones.js';

const createUsuario = async (req, res) => {
  const {
    nombre,
    apellido,
    correoElectronico,
    contrasenia,
    idTipoUsuario,
    imagen 
  } = req.body;

  // Validaciones básicas
    const errores = validarUsuario(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ errores });
  }
    // Validar si el correo electrónico ya está en uso
    const existeCorreo = await validarCorreoExistente(correoElectronico);
    if (existeCorreo) {
        return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
    }
  try {
    const query = `
      INSERT INTO usuarios 
      (nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    
    const values = [nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen || null]; // Usar null si no se proporciona imagen

    // Ejecutar la consulta
    await conexion.query(query, values); 

    res.status(201).json({ mensaje: 'Usuario creado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el usuario' });
  }
};

const getAllUsuarios = async (req, res) => {
  try {
    const [rows] = await conexion.query('SELECT usuarios.idUsuario, usuarios.nombre, usuarios.apellido, usuarios.correoElectronico, usuarios.contrasenia, tipos.descripcion AS tipoUsuario, usuarios.imagen, usuarios.activo FROM usuarios JOIN usuariosTipo AS tipos ON usuarios.idTipoUsuario = tipos.idUsuarioTipo;');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
  }
};

export default {
  createUsuario,
  getAllUsuarios,
};
