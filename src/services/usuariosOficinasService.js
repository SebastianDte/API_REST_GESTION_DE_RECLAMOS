
import UsuariosOficinasDB from '../db/usuariosOficinasDB.js';


class UsuariosOficinasService {
    async crearRelacion(idUsuario, idOficina, body) {
        // Validación de entrada
        if (!idUsuario || !idOficina) {
            throw new Error("Error: se requiere tanto idUsuario como idOficina.");
        }

        if (typeof idUsuario !== 'number' || typeof idOficina !== 'number') {
            throw new Error("Error: idUsuario y idOficina deben ser números.");
        }
        const tipoUsuario = await UsuariosOficinasDB.obtenerTipoUsuario(idUsuario);
        console.log('Tipo de usuario obtenido:', tipoUsuario); // Agregado para depuración

        if (!tipoUsuario || tipoUsuario.trim().toLowerCase() !== 'empleado') {
            throw new Error("Error: solo los usuarios de tipo 'empleado' pueden ser asignados a una oficina.");
        }

        // Validar que no hay información extra en el cuerpo
        const allowedFields = ['idUsuario', 'idOficina'];
        const extraFields = Object.keys(body).filter(field => !allowedFields.includes(field));

        if (extraFields.length > 0) {
            throw new Error(`Error: información extra en la solicitud. Solo se admite ${allowedFields.join(', ')}.`);
        }

        // Verificar existencia de usuario y oficina
        const existeUsuario = await UsuariosOficinasDB.existeUsuario(idUsuario);
        const existeOficina = await UsuariosOficinasDB.existeOficina(idOficina);

        if (!existeUsuario) {
            throw new Error("Error: el idUsuario no existe.");
        }
        if (!existeOficina) {
            throw new Error("Error: el idOficina no existe.");
        }

        // Verificar si la relación ya existe
        const existeRelacion = await UsuariosOficinasDB.existeRelacion(idUsuario, idOficina);
        if (existeRelacion) {
            throw new Error("Error: la relación entre el usuario y la oficina ya existe.");
        }

        // Crear la relación
        return await UsuariosOficinasDB.crearRelacion(idUsuario, idOficina);
    }

    async listarRelaciones(idOficina = null, idTipoUsuario = null) {
        return await UsuariosOficinasDB.listarRelaciones(idOficina, idTipoUsuario);
    }
    async actualizarRelacion(idUsuarioOficina, body) {
       
        if (!idUsuarioOficina) {
            throw new Error("Error: se requiere el idUsuarioOficina.");
        }

        const relacionExistente = await UsuariosOficinasDB.obtenerRelacionPorId(idUsuarioOficina);
        if (!relacionExistente) {
            throw new Error("Error: la relación no existe.");
        }

        // Validar que no hay información extra en el cuerpo
        const allowedFields = ['idOficina', 'idUsuario'];
        const extraFields = Object.keys(body).filter(field => !allowedFields.includes(field));

        if (extraFields.length > 0) {
            throw new Error(`Error: información extra en la solicitud. Solo se admite ${allowedFields.join(', ')}.`);
        }

        // Validación de tipos de datos
        if (body.idOficina !== undefined && typeof body.idOficina !== 'number') {
            throw new Error("Error: idOficina debe ser un número.");
        }

        if (body.idUsuario !== undefined && typeof body.idUsuario !== 'number') {
            throw new Error("Error: idUsuario debe ser un número.");
        }

        // Verificar si existe ID de usuario y oficina
        if (body.idUsuario) {
            const existeUsuario = await UsuariosOficinasDB.existeUsuario(body.idUsuario);
            if (!existeUsuario) {
                throw new Error("Error: el idUsuario no existe.");
            }

            const tipoUsuario = await UsuariosOficinasDB.obtenerTipoUsuario(body.idUsuario);
            if (!tipoUsuario || tipoUsuario.trim().toLowerCase() !== 'empleado') {
                throw new Error("Error: solo los usuarios de tipo 'empleado' pueden ser asignados a una oficina.");
            }
        }

        if (body.idOficina) {
            const existeOficina = await UsuariosOficinasDB.existeOficina(body.idOficina);
            if (!existeOficina) {
                throw new Error("Error: el  idOficina no existe.");
            }
        }

        return await UsuariosOficinasDB.actualizarRelacion(idUsuarioOficina, body);
    }

    async eliminarRelacion(id) {
        const resultado = await UsuariosOficinasDB.eliminarRelacion(id);
        if (!resultado) {
            throw new Error("Error: la relación no existe o ya está inactiva.");
        }
        return { mensaje: "Relación desactivada correctamente." };
    }

    async activarRelacion(id) {
        const resultado = await UsuariosOficinasDB.activarRelacion(id);
        return resultado; // Retornamos el resultado de la DB
    }

    async obtenerRelacionPorId(idUsuarioOficina) {
        const relacion = await UsuariosOficinasDB.obtenerRelacionPorId(idUsuarioOficina);
        if (!relacion) {
            throw new Error("Error: la relación no existe o está inactiva.");
        }
        return relacion;
    }
}

export default new UsuariosOficinasService();