import UsuariosTipoDB from '../db/usuariosTipoDB.js';
import { validarDescripcion, validarSoloDescripcion, validarExistenciaDescripcion } from '../utils/validacionesUsuariosTipos.js';

const usuariosTipoDB = new UsuariosTipoDB();

class UsuariosTipoService {

    async createUsuarioTipoService(body) {
        // Validación de entrada
        validarSoloDescripcion(body);
        
        const { descripcion } = body;
        
        // Validación de descripción
        validarDescripcion(descripcion);
        
        // Validar si ya existe un tipo de usuario con la misma descripción
        await validarExistenciaDescripcion(descripcion, usuariosTipoDB);
    
        // Crear el tipo de usuario en la base de datos
        const result = await usuariosTipoDB.createUsuarioTipo(descripcion);
        return { mensaje: 'Tipo de usuario creado exitosamente.', result };
    }
    // Servicio para obtener todos los tipos de usuario
    async getAllUsuariosTipoService() {
        return await usuariosTipoDB.getAllUsuariosTipo();
    };

    async updateUsuarioTipoService(id, body) {
        // Validación de entrada: asegurarse de que solo se permite el campo 'descripcion'
        validarSoloDescripcion(body);
        
        const { descripcion } = body;
    
        // Validación de descripción: debe estar presente y no ser vacía
        validarDescripcion(descripcion);
    
        // Validar si la descripción ya existe en otro tipo de usuario (excluyendo el actual)
        await validarExistenciaDescripcion(descripcion, usuariosTipoDB);
    
        // Actualizar el tipo de usuario en la base de datos
        await usuariosTipoDB.updateUsuarioTipo(id, { descripcion });
        return { mensaje: 'Tipo de usuario actualizado exitosamente.' };
    }

    // Servicio para dar de baja lógica a un tipo de usuario
   async deleteUsuarioTipoService(id) {
    // Verificar si el tipo de usuario existe y está activo
    const usuarioTipo = await usuariosTipoDB.getUsuarioTipoById(id);
    if (!usuarioTipo) {
        throw new Error("No existe un tipo de usuario con este ID.");
    }
    
    if (!usuarioTipo.activo) {
        throw new Error("El tipo de usuario ya ha sido dado de baja.");
    }

    // Realizar la baja lógica
    await usuariosTipoDB.bajaLogicaUsuarioTipo(id);

    return { mensaje: 'Tipo de usuario dado de baja exitosamente.' };
}

async altaUsuarioTipoService(id) {
    // Verificar si el tipo de usuario existe
    const usuarioTipo = await usuariosTipoDB.getUsuarioTipoById(id);
    if (!usuarioTipo) {
        throw new Error("No existe un tipo de usuario con este ID.");
    }
    
    if (usuarioTipo.activo) {
        throw new Error("El tipo de usuario ya está activo.");
    }

    // Realizar la alta lógica
    await usuariosTipoDB.altaLogicaUsuarioTipo(id);

    return { mensaje: 'Tipo de usuario dado de alta exitosamente.' };
}



}


export default UsuariosTipoService;
