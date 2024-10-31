import UsuariosOficinasDB from '../db/usuariosOficinasDB.js';

class UsuariosOficinasService {
    constructor() {
        this.usuariosOficinasDB = new UsuariosOficinasDB();
    }

    async validarExistencia(idUsuario, idOficina) {
        const usuarioExiste = await this.usuariosOficinasDB.existeUsuario(idUsuario);
        const oficinaExiste = await this.usuariosOficinasDB.existeOficina(idOficina);
        return usuarioExiste && oficinaExiste;
    }

    async crearRelacion(idUsuario, idOficina) {
        // Validación de entrada
        if (!idUsuario || !idOficina) {
            throw new Error("Error: se requiere tanto idUsuario como idOficina.");
        }
    
        if (typeof idUsuario !== 'number' || typeof idOficina !== 'number') {
            throw new Error("Error: idUsuario y idOficina deben ser números.");
        }
    
        // Validación para evitar idUsuarioOficina
        if (req.body.idUsuarioOficina !== undefined) {
            throw new Error("Error: no se debe proporcionar idUsuarioOficina, es autoincremental.");
        }
    
        // Validación para evitar campo activo
        if (req.body.activo !== undefined) {
            throw new Error("Error: el campo 'activo' no debe ser proporcionado en la creación.");
        }
    
        // Verificar si la relación ya existe
        const existeRelacion = await this.usuariosOficinasDB.existeRelacion(idUsuario, idOficina);
        if (existeRelacion) {
            throw new Error("Error: la relación entre el usuario y la oficina ya existe.");
        }
    
        // Si todas las validaciones pasan, crear la relación
        return await this.usuariosOficinasDB.crearRelacion(idUsuario, idOficina);
    }

    async listarRelaciones(idUsuario, idOficina) {
        return await this.usuariosOficinasDB.listarRelaciones(idUsuario, idOficina);
    }

    async actualizarRelacion(id, idOficina, activo) {
        return await this.usuariosOficinasDB.actualizarRelacion(id, idOficina, activo);
    }

    async eliminarRelacion(id) {
        return await this.usuariosOficinasDB.eliminarRelacion(id);
    }
}

export default UsuariosOficinasService;
