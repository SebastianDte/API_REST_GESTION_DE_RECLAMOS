import reclamosEstadoDB from '../db/reclamosEstadoDB.js';
import { validarDescripcionNoVacia, validarSoloDescripcion, validarDescripcionUnica } from "../utils/validacionesReclamosEstados.js"

class ReclamosEstadoService {
   
    async createReclamoEstadoService(data) {
        const { descripcion } = data;

        validarDescripcionNoVacia(descripcion);
        validarSoloDescripcion(data);
        await validarDescripcionUnica(descripcion);

        const result = await reclamosEstadoDB.createReclamoEstado(descripcion);
        return { mensaje: 'Estado de reclamo creado exitosamente.', result };
    };

    async getAllReclamosEstadoService() {
        return await reclamosEstadoDB.getAllReclamosEstado();
    };

    async updateReclamoEstadoService(id, data) {
       
        const reclamoEstadoExistente = await reclamosEstadoDB.findReclamoEstadoById(id);
        if (!reclamoEstadoExistente) {
            throw new Error('El ID proporcionado no existe en la base de datos.');
        }
    
        validarSoloDescripcion(data);
    
        const { descripcion } = data;
    
        validarDescripcionNoVacia(descripcion);
    
        await validarDescripcionUnica(descripcion, id);
    
        await reclamosEstadoDB.updateReclamoEstado(id, { descripcion });
        return { mensaje: 'Estado de reclamo actualizado exitosamente.' };
    };
    
    async deleteReclamoEstadoService(id) {
        
        const reclamoEstadoExistente = await reclamosEstadoDB.findReclamoEstadoById(id);
        if (!reclamoEstadoExistente) {
            throw new Error('El ID proporcionado no existe en la base de datos.');
        }
    
        if (reclamoEstadoExistente.activo === 0) {
            throw new Error('El estado de reclamo ya ha sido dado de baja.');
        }

        await reclamosEstadoDB.bajaLogicaReclamoEstado(id);
        return { mensaje: 'Estado de reclamo dado de baja exitosamente.' };
    };

    async activateReclamoEstadoService(id) {
        const reclamoEstadoExistente = await reclamosEstadoDB.findReclamoEstadoById(id);
        if (!reclamoEstadoExistente) {
            throw new Error('El ID proporcionado no existe en la base de datos.');
        }
    
        if (reclamoEstadoExistente.activo === 1) {
            throw new Error('El estado de reclamo ya está activo.');
        }
    
        await reclamosEstadoDB.altaLogicaReclamoEstado(id);
        return { mensaje: 'Estado de reclamo activado exitosamente.' };
    };


}


export default new ReclamosEstadoService();
