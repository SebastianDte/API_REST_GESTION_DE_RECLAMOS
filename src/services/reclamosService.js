// reclamosServicio.js
import ReclamosDB from '../db/reclamosDB.js';
import { validarCamposObligatorios, validarCamposPermitidos, validarExistenciaIds, validarCamposObligatoriosActualizar, validarExistenciaIdsActualizar, validarCamposPermitidosUpdate, validarFormatoFecha } from '../utils/validacionesReclamos.js'


class ReclamosServicio {
    async obtenerReclamos(idUsuario) {
        try {
            const reclamos = await ReclamosDB.obtenerReclamosPorUsuario(idUsuario);
            return reclamos;
        } catch (error) {
            console.error("Error en el servicio de reclamos:", error);
            throw new Error("Error al obtener los reclamos");
        }

    }

    async obtenerReclamo(id) {
        return await ReclamosDB.obtenerReclamoPorId(id);
    }

    async crearReclamo(reclamo) {
        // Validar que los campos sean correctos
        validarCamposObligatorios(reclamo);
        validarCamposPermitidos(reclamo);

        // Verificar que los IDs existan
        await validarExistenciaIds(reclamo);

        // Si todas las validaciones son correctas, insertar el reclamo en la base de datos
        return await ReclamosDB.crearReclamo(reclamo);
    }

    async actualizarReclamo(id, datosActualizados) {
        // Comprobación de campos que no deben ser actualizados
        if (datosActualizados.idUsuarioCreador !== undefined || datosActualizados.idUsuarioFinalizador !== undefined) {
            throw new Error("No se permite modificar el idUsuarioCreador o idUsuarioFinalizador.");
        }

        // Validar formato de fechas
        if (datosActualizados.fechaCancelado) {
            validarFormatoFecha(datosActualizados.fechaCancelado);
        }
        if (datosActualizados.fechaFinalizado) {
            validarFormatoFecha(datosActualizados.fechaFinalizado);
        }

        // Validar campos obligatorios para la actualización
        validarCamposObligatoriosActualizar(datosActualizados);

        // Validar los campos permitidos
        validarCamposPermitidosUpdate(datosActualizados);

        // Validar la existencia de IDs solo para los campos relevantes
        await validarExistenciaIdsActualizar(datosActualizados);

        // Verificar que el reclamo existe antes de actualizar.
        const reclamoExistente = await ReclamosDB.obtenerReclamoPorId(id);
        if (!reclamoExistente) {
            throw new Error("No se encontró el reclamo a actualizar.");
        }

        // Realizar la actualización en la base de datos.
        return await ReclamosDB.actualizarReclamo(id, datosActualizados);
    }



    async eliminarReclamo(id) {
        return await ReclamosDB.eliminarReclamo(id);
    }
}

export default new ReclamosServicio();