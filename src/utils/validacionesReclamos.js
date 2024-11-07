import ReclamosDB from '../db/reclamosDB.js';
import moment from 'moment';


export const validarFormatoFecha = (fecha) => {
    if (fecha && !moment(fecha, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
        throw new Error("El formato de la fecha es inválido. Debe ser 'YYYY-MM-DD HH:MM:SS'.");
    }
};

export const validarCamposObligatoriosCrear = (reclamo) => {
    const { asunto, descripcion, idReclamoTipo,  } = reclamo;

    if (!asunto || asunto.trim() === "") {
        throw new Error("El asunto es requerido y no puede estar vacío.");
    }
    if (descripcion === undefined) {
        throw new Error("La descripción es requerida.");
    }
   
    if (!idReclamoTipo) {
        throw new Error("El idReclamoTipo es requerido.");
    }
 
};
export const validarCamposPermitidosCrear = (body) => {
    const allowedFields = ['asunto', 'descripcion', 'idReclamoTipo'];
    const receivedFields = Object.keys(body);

    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        throw new Error(`Los siguientes campos no están permitidos: ${invalidFields.join(', ')}`);
    }
};
export const validarExistenciaIdsCrear = async (reclamo) => {
    const { idReclamoTipo} = reclamo;

    const tipoExiste = await ReclamosDB.validarTipoExiste(idReclamoTipo);
    if (!tipoExiste) {
        throw new Error(`El idReclamoTipo ${idReclamoTipo} no existe.`);
    }
  
};









export const validarCamposObligatorios = (reclamo) => {
    const { asunto, descripcion, idReclamoEstado, idReclamoTipo, idUsuarioCreador } = reclamo;

    if (!asunto || asunto.trim() === "") {
        throw new Error("El asunto es requerido y no puede estar vacío.");
    }
    if (descripcion === undefined) {
        throw new Error("La descripción es requerida.");
    }
    if (!idReclamoEstado) {
        throw new Error("El idReclamoEstado es requerido.");
    }
    if (!idReclamoTipo) {
        throw new Error("El idReclamoTipo es requerido.");
    }
    if (!idUsuarioCreador) {
        throw new Error("El idUsuarioCreador es requerido.");
    }
};

export const validarCamposPermitidos = (body) => {
    const allowedFields = ['asunto', 'descripcion', 'idReclamoEstado', 'idReclamoTipo', 'idUsuarioCreador'];
    const receivedFields = Object.keys(body);

    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        throw new Error(`Los siguientes campos no están permitidos: ${invalidFields.join(', ')}`);
    }
};






export const validarExistenciaIds = async (reclamo) => {
    const { idReclamoEstado, idReclamoTipo, idUsuarioCreador } = reclamo;

    const estadoExiste = await ReclamosDB.validarEstadoExiste(idReclamoEstado);
    if (!estadoExiste) {
        throw new Error(`El idReclamoEstado ${idReclamoEstado} no existe.`);
    }

    const tipoExiste = await ReclamosDB.validarTipoExiste(idReclamoTipo);
    if (!tipoExiste) {
        throw new Error(`El idReclamoTipo ${idReclamoTipo} no existe.`);
    }

    const usuarioExiste = await ReclamosDB.validarUsuarioExiste(idUsuarioCreador);
    if (!usuarioExiste) {
        throw new Error(`El idUsuarioCreador ${idUsuarioCreador} no existe.`);
    }
};


export const validarCamposPermitidosUpdate = (body) => {
    const allowedFields = ['asunto', 'descripcion', 'idReclamoEstado', 'idReclamoTipo', 'fechaFinalizado']; // Asegúrate de incluir 'fechaFinalizado'
    const receivedFields = Object.keys(body);

    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        throw new Error(`Los siguientes campos no están permitidos: ${invalidFields.join(', ')}`);
    }
};

export const validarExistenciaIdsActualizar = async (reclamo) => {
    const { idReclamoEstado, idReclamoTipo } = reclamo;

    // Verificar solo si el idReclamoEstado está presente
    if (idReclamoEstado !== undefined) {
        const estadoExiste = await ReclamosDB.validarEstadoExiste(idReclamoEstado);
        if (!estadoExiste) {
            throw new Error(`El idReclamoEstado ${idReclamoEstado} no existe.`);
        }
    }

    // Verificar solo si el idReclamoTipo está presente
    if (idReclamoTipo !== undefined) {
        const tipoExiste = await ReclamosDB.validarTipoExiste(idReclamoTipo);
        if (!tipoExiste) {
            throw new Error(`El idReclamoTipo ${idReclamoTipo} no existe.`);
        }
    }

    // No validamos idUsuarioCreador, ya que no debe ser parte de la actualización.
};

export const validarCamposObligatoriosActualizar = (reclamo) => {
    const { asunto, descripcion, idReclamoEstado, idReclamoTipo } = reclamo;

    if (asunto !== undefined && asunto.trim() === "") {
        throw new Error("El asunto no puede estar vacío.");
    }
    if (descripcion !== undefined && descripcion === "") {
        throw new Error("La descripción no puede estar vacía.");
    }
    
    // Solo se requiere que verifiques el idReclamoEstado si se incluye en la solicitud
    if (idReclamoEstado !== undefined && idReclamoEstado === null) {
        throw new Error("El idReclamoEstado es requerido.");
    }
    
    // Solo se requiere que verifiques el idReclamoTipo si se incluye en la solicitud
    if (idReclamoTipo !== undefined && idReclamoTipo === null) {
        throw new Error("El idReclamoTipo es requerido.");
    }
};

export const validarCamposPermitidosUpdateCliente = (body) => {
    const allowedFields = ['idReclamoEstado']; 
    const receivedFields = Object.keys(body);

    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        throw new Error(`Los siguientes campos no están permitidos: ${invalidFields.join(', ')}`);
    }
};


