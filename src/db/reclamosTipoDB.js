import { conexion } from './conexion.js';

class ReclamosTipoDB {

    async createReclamoTipo(descripcion) {
        const [result] = await conexion.execute(
            'INSERT INTO reclamosTipo (descripcion, activo) VALUES (?, 1)',
            [descripcion]
        );
        return result;
    }

    async buscarPorDescripcion(descripcion) {
        const [rows] = await conexion.execute(
            'SELECT idReclamoTipo FROM reclamosTipo WHERE descripcion = ?',
            [descripcion]
        );
        return rows.length > 0 ? rows[0] : null;
    };

    async getAllReclamosTipo() {
        const [tipos] = await conexion.execute('SELECT * FROM reclamosTipo WHERE activo = 1');
        return tipos;
    };

    async updateReclamoTipo(id, { descripcion }) {
        await conexion.execute('UPDATE reclamosTipo SET descripcion = ? WHERE idReclamoTipo = ?', [descripcion, id]);
    };

    async buscarPorId(id) {
        const [rows] = await conexion.execute('SELECT * FROM reclamosTipo WHERE idReclamoTipo = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async bajaLogicaReclamoTipo(id) {
        await conexion.execute('UPDATE reclamosTipo SET activo = 0 WHERE idReclamoTipo = ?', [id]);
    };

    async buscarPorId(id) {
        const [rows] = await conexion.execute('SELECT * FROM reclamosTipo WHERE idReclamoTipo = ?', [id]);
        return rows[0]; 
    }
    async altaReclamoTipo(id) {
        await conexion.execute('UPDATE reclamosTipo SET activo = 1 WHERE idReclamoTipo = ?', [id]);
    }

}


export default ReclamosTipoDB;