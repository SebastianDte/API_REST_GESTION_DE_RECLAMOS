// src/controllers/usuariosController.js
import { conexion } from '../db/conexion.js'; // Importamos la conexión a la base de datos
import { validarUsuario,validarCorreoExistente } from '../utils/validaciones.js';
import {paginarResultados} from '../utils/paginacion.js'

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
// Obtener usuarios con paginación
const getPaginatedUsuarios = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Obtener el número de página
  const pageSize = parseInt(req.query.pageSize) || 10; // Obtener el tamaño de la página

  const queryBase = `
    SELECT 
      usuarios.idUsuario, 
      usuarios.nombre, 
      usuarios.apellido, 
      usuarios.correoElectronico, 
      usuarios.contrasenia, 
      tipos.descripcion AS tipoUsuario, 
      usuarios.imagen, 
      usuarios.activo 
    FROM 
      usuarios 
    JOIN 
      usuariosTipo AS tipos 
    ON 
      usuarios.idTipoUsuario = tipos.idUsuarioTipo
  `;

  try {
    const paginatedResult = await paginarResultados(queryBase, page, pageSize, conexion);
    res.status(200).json(paginatedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
  }
};

//Actualizar un usuario
const updateUsuario = async (req, res) => {
  const { idUsuario } = req.params; // Obtener el ID del usuario desde los parámetros
  console.log(`ID del usuario a actualizar: ${idUsuario}`);
  const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen } = req.body;

  // Validaciones opcionales para campos que deseas asegurarte que no sean nulos o vacíos.
  const errores = validarUsuario(req.body); // Puedes ajustar esto según cómo manejes la validación
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  // Construir la consulta de actualización
  const updates = [];
  const values = [];

  if (nombre) {
    updates.push('nombre = ?');
    values.push(nombre);
  }
  if (apellido) {
    updates.push('apellido = ?');
    values.push(apellido);
  }
  if (correoElectronico) {
    updates.push('correoElectronico = ?');
    values.push(correoElectronico);
  }
  if (contrasenia) {
    updates.push('contrasenia = ?');
    values.push(contrasenia);
  }
  if (idTipoUsuario) {
    updates.push('idTipoUsuario = ?');
    values.push(idTipoUsuario);
  }
  if (imagen) {
    updates.push('imagen = ?');
    values.push(imagen);
  }

  // Si no hay campos para actualizar
  if (updates.length === 0) {
    return res.status(400).json({ mensaje: 'No se proporcionaron campos para actualizar.' });
  }

  // Agregar el ID del usuario al final de los valores
  values.push(idUsuario);

  try {
    const query = `
      UPDATE usuarios 
      SET ${updates.join(', ')}
      WHERE idUsuario = ?
    `;

    const [result] = await conexion.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
};


export default {
  createUsuario,
  getAllUsuarios,
  getPaginatedUsuarios,
  updateUsuario,
};
