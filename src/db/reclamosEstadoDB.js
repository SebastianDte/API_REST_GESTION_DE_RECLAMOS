import { conexion } from './conexion.js';

class UsuariosDB {

    async findReclamoEstadoByDescripcion(descripcion) {
        const [rows] = await conexion.execute('SELECT * FROM reclamosEstado WHERE descripcion = ?', [descripcion]);
        return rows[0];
    };

    async findReclamoEstadoById(id) {
        const [rows] = await conexion.execute('SELECT * FROM reclamosEstado WHERE idReclamoEstado = ?', [id]);
        return rows[0]; 
    };

    async createReclamoEstado(descripcion) {
        const [result] = await conexion.execute('INSERT INTO reclamosEstado (descripcion, activo) VALUES (?, ?)', [descripcion, 1]);
        return result;
    };

    async getAllReclamosEstado() {
        const [estados] = await conexion.execute('SELECT * FROM reclamosEstado WHERE activo = 1');
        return estados;
    };

    async updateReclamoEstado  (id, { descripcion }) {
        await conexion.execute('UPDATE reclamosEstado SET descripcion = ? WHERE idReclamoEstado = ?', [descripcion, id]);
    };
    
    async bajaLogicaReclamoEstado(id) {
        await conexion.execute('UPDATE reclamosEstado SET activo = 0 WHERE idReclamoEstado = ?', [id]);
    };

    async altaLogicaReclamoEstado(id) {
        await conexion.execute('UPDATE reclamosEstado SET activo = 1 WHERE idReclamoEstado = ?', [id]);
    };
}


export default new UsuariosDB();
