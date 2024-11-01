import ReclamosTipoDB from "../db/reclamosTipoDB.js";
const reclamosTipoDB = new ReclamosTipoDB();

import { validarReclamoTipo } from '../utils/validacionesReclamosTipo.js';

class ReclamosTipoService {

    async createReclamoTipoService(body) {
       
        const validFields = ['descripcion']; // Campos permitidos
        const bodyFields = Object.keys(body); 
        const invalidFields = bodyFields.filter(field => !validFields.includes(field));

        if (invalidFields.length > 0) {
            throw new Error(`Solo se admite el campo 'descripcion'. Campos no válidos: ${invalidFields.join(', ')}`);
        }

        
        await validarReclamoTipo(body.descripcion);

       
        const result = await reclamosTipoDB.createReclamoTipo(body.descripcion);
        return { mensaje: 'Tipo de reclamo creado exitosamente.', result };
    }

    async getAllReclamosTipoService() {
        return await reclamosTipoDB.getAllReclamosTipo();
    }

    async updateReclamoTipoService(body, id) {
        const validFields = ['descripcion']; 
        const bodyFields = Object.keys(body); 
        const invalidFields = bodyFields.filter(field => !validFields.includes(field));

        if (invalidFields.length > 0) {
            throw new Error(`Solo se admite el campo 'descripcion'. Campos no válidos: ${invalidFields.join(', ')}`);
        }

        await validarReclamoTipo(body.descripcion);

        const reclamoExistente = await reclamosTipoDB.buscarPorId(id);
        if (!reclamoExistente) {
            throw new Error(`No existe un tipo de reclamo con el ID: ${id}`);
        }

        await reclamosTipoDB.updateReclamoTipo(id, { descripcion: body.descripcion });
        return { mensaje: 'Tipo de reclamo actualizado exitosamente.' };
    }
    
    async deleteReclamoTipoService(id) {
       
        const reclamoExistente = await reclamosTipoDB.buscarPorId(id);
        if (!reclamoExistente) {
            throw new Error("El tipo de reclamo no existe.");
        }
    
       
        if (reclamoExistente.activo === 0) {
            throw new Error("El tipo de reclamo ya fue dado de baja.");
        }
    
       
        await reclamosTipoDB.bajaLogicaReclamoTipo(id);
        return { mensaje: 'Tipo de reclamo dado de baja exitosamente.' };
    }

    async altaReclamoTipoService(id) {
      
        const reclamoExistente = await reclamosTipoDB.buscarPorId(id);
        if (!reclamoExistente) {
            throw new Error("El tipo de reclamo no existe.");
        }
    
       
        if (reclamoExistente.activo === 1) {
            throw new Error("El tipo de reclamo ya está activo.");
        }
    
        
        await reclamosTipoDB.altaReclamoTipo(id);
        return { mensaje: 'Tipo de reclamo activado exitosamente.' };
    }
}


export default new ReclamosTipoService();
