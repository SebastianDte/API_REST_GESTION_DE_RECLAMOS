// reclamosServicio.js
import ReclamosDB from '../db/reclamosDB.js';
import { validarCamposObligatoriosCrear,validarExistenciaIdsCrear, validarFormatoFecha,  } from '../utils/validacionesReclamos.js'
import { sendEmail } from '../utils/enviarEmail.js';
import UsuariosDB from '../db/usuariosDB.js';
const usuariosDB = new UsuariosDB();

class ReclamosServicio {
    async obtenerReclamos(idUsuario, rol, req) {
        try {
            let reclamos;
            const filtros = {
                idReclamoEstado: req.query.idReclamoEstado || null,
                idReclamoTipo: req.query.idReclamoTipo || null,
                fechaCreacionInicio: req.query.fechaCreacionInicio || null,
                fechaCreacionFin: req.query.fechaCreacionFin || null,
                fechaFinalizacionInicio: req.query.fechaFinalizacionInicio || null,
                fechaFinalizacionFin: req.query.fechaFinalizacionFin || null,
                palabraClave: req.query.palabraClave || null,
                page: req.query.page || 1,
                limit: req.query.limit || 10
            };
            if (rol === 3) {  // Cliente
                reclamos = await ReclamosDB.obtenerReclamosPorUsuario(idUsuario);
            } else if (rol === 2) {  // Empleado
                reclamos = await ReclamosDB.obtenerReclamosPorOficinaParaEmpleado(idUsuario); // Llamada específica para empleados
            } else if (rol === 1) {  // Administrador
                reclamos = await ReclamosDB.obtenerTodosLosReclamos(filtros); // Método para obtener todos los reclamos para el admin
            }
            else {
                throw new Error("Rol no autorizado para acceder a los reclamos");
            }

            // Eliminar campos nulos solo una vez antes de retornar
            const reclamosFiltrados = reclamos.map(reclamo => {
                if (!reclamo.fechaCancelado) delete reclamo.fechaCancelado;
                if (!reclamo.fechaFinalizado) delete reclamo.fechaFinalizado;
                return reclamo;
            });

            return reclamosFiltrados;
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
        validarCamposObligatoriosCrear(reclamo);  
        //validarCamposPermitidosCrear(reclamo);   
        
        // Validar que los IDs existan en las tablas correspondientes
        await validarExistenciaIdsCrear(reclamo); 
        
        // Insertar el reclamo en la base de datos
        return await ReclamosDB.crearReclamo(reclamo);  
    };


    async actualizarReclamoAdmin(id, datosActualizados) {
        // Validar campos y fechas 
        if (datosActualizados.idUsuarioCreador || datosActualizados.idUsuarioFinalizador) {
            throw new Error("No se permite modificar el idUsuarioCreador o idUsuarioFinalizador.");
        }

        if (datosActualizados.fechaCancelado) validarFormatoFecha(datosActualizados.fechaCancelado);
        if (datosActualizados.fechaFinalizado) validarFormatoFecha(datosActualizados.fechaFinalizado);

        // Validar existencia de reclamo
        const reclamoExistente = await ReclamosDB.obtenerReclamoPorId(id);
        if (!reclamoExistente) {
            throw new Error("No se encontró el reclamo a actualizar.");
        }

        
        return await ReclamosDB.actualizarReclamo(id, datosActualizados);
    };

    async actualizarReclamoEmpleado(id, idUsuario, datosActualizados) {
        // Obtener el reclamo existente
        const reclamoExistente = await ReclamosDB.obtenerReclamoPorIdUpdate(id);
        if (!reclamoExistente) {
            throw new Error("No se encontró el reclamo a actualizar.");
        }

        // Obtener la oficina asociada al empleado
        const oficinaEmpleado = await ReclamosDB.obtenerOficinaPorUsuario(idUsuario);
        console.log("Oficina del empleado:", oficinaEmpleado);
        console.log("Reclamo existente:", reclamoExistente);
        // Obtener la oficina asociada al tipo de reclamo
        const oficinaPorReclamoTipo = await ReclamosDB.obtenerOficinaPorTipoReclamo(reclamoExistente.idReclamoTipo);
        console.log("Oficina asociada al tipo de reclamo:", oficinaPorReclamoTipo);
        console.log("Tipo de reclamo de la oficina del empleado:", oficinaEmpleado.idReclamoTipo);
        console.log("Tipo de reclamo asociado al reclamo:", reclamoExistente.idReclamoTipo);
        // Verificar que la oficina del empleado coincide con la oficina asociada al tipo de reclamo
        if (Number(oficinaEmpleado.idReclamoTipo) !== Number(reclamoExistente.idReclamoTipo)) {
            console.log("El reclamo no pertenece a la oficina del empleado.");
            throw new Error("No tienes permiso para modificar reclamos de otras oficinas.");
        }

        // Validar que el nuevo estado sea uno permitido para el empleado
        if (datosActualizados.idReclamoEstado) {
            console.log("Estado que se intenta actualizar:", datosActualizados.idReclamoEstado);
            if (![2, 3, 4].includes(datosActualizados.idReclamoEstado)) {  // ID 2 = "enproceso", ID 3 = "cancelado", ID 4 = "finalizado"
                console.log('Estado no válido para un empleado:', datosActualizados.idReclamoEstado);
                throw new Error("Solo puedes cambiar el estado a 'en_proceso', 'cancelado' o 'finalizado'.");
            }
        }


        // Verificar que el reclamo no esté finalizado, Si no no se puede modificiar
        if (reclamoExistente.idReclamoEstado === 4) {  // Estado "finalizado"
            console.log("El reclamo ya está en estado 'finalizado', no se puede modificar.");
            throw new Error("No puedes modificar un reclamo que ya está finalizado.");
        }

        const usuarioCliente = await usuariosDB.obtenerUsuarioPorId(reclamoExistente.idUsuarioCreador);
        if (usuarioCliente) {
            const correoCliente = usuarioCliente.correoElectronico;
            const datos = {
                nombreCliente: usuarioCliente.nombre, // Nombre del cliente
                estadoReclamo: nuevoEstado,           // El nuevo estado del reclamo
                year: new Date().getFullYear()        // Año actual para el pie de página
            };
        
            try {
                // Llamar a la función sendEmail para enviar el correo
                await sendEmail(correoCliente, datos, 'cambioEstadoReclamo');
                console.log(`Correo enviado correctamente a ${correoCliente}`);
            } catch (error) {
                console.error('Error al enviar el correo:', error.message);
            }
        }

        // Si todo está OK, actualizamos el reclamo
        console.log("Actualizando el reclamo con los siguientes datos:", datosActualizados);
        return await ReclamosDB.actualizarReclamoEmpleado(id, datosActualizados);
    }


    async actualizarReclamoCliente(id, idUsuario, datosActualizados) {
        const reclamoExistente = await ReclamosDB.obtenerReclamoPorIdVal(id);

        if (!reclamoExistente) {
            throw new Error("No se encontró el reclamo a actualizar.");
        }

        console.log('Estado actual del reclamo:', reclamoExistente.idReclamoEstado);

        if (reclamoExistente.idUsuarioCreador !== idUsuario) {
            throw new Error("No puedes modificar este reclamo.");
        }

        // Solo puede cancelar si está en estado "creado" (ID = 1)
        if (reclamoExistente.idReclamoEstado !== 1) {  
            console.log('Estado no es "creado", es:', reclamoExistente.idReclamoEstado);
            throw new Error("Solo puedes cancelar un reclamo en estado 'creado'.");
        }

        // Verificar que el nuevo estado sea "cancelado" (ID = 3)
        if (datosActualizados.idReclamoEstado && datosActualizados.idReclamoEstado !== 3) {  
            console.log('Estado que se intenta poner:', datosActualizados.idReclamoEstado);
            throw new Error("Solo puedes cancelar el reclamo.");
        }


        return await ReclamosDB.actualizarReclamoCliente(id, datosActualizados);
    }

    async eliminarReclamo(id) {
        return await ReclamosDB.eliminarReclamo(id);
    }
}

export default new ReclamosServicio();