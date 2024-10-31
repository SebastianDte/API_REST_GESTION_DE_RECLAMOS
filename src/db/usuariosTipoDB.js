import { conexion } from './conexion.js';

class UsuariosTipoDB{
    // Función para crear un tipo de usuario
    async createUsuarioTipo(descripcion) {
        const [result] = await conexion.execute('INSERT INTO usuariosTipo (descripcion, activo) VALUES (?, ?)', [descripcion, 1]);
        return result;
    }
    
// Función para obtener todos los tipos de usuario
async getAllUsuariosTipo(){
    const [tipos] = await conexion.execute('SELECT * FROM usuariosTipo WHERE activo = 1');
    return tipos;
};

// Función para actualizar un tipo de usuario
async updateUsuarioTipo(id, { descripcion }){
    await conexion.execute('UPDATE usuariosTipo SET descripcion = ? WHERE idUsuarioTipo = ?', [descripcion, id]);
};

async getUsuarioTipoById(id) {
    const [rows] = await conexion.execute('SELECT * FROM usuariosTipo WHERE idUsuarioTipo = ?', [id]);
    return rows[0] || null; // Retorna el primer resultado o null si no existe
}
async bajaLogicaUsuarioTipo(id) {
    await conexion.execute('UPDATE usuariosTipo SET activo = 0 WHERE idUsuarioTipo = ?', [id]);
}

// Función para realizar la alta lógica
// Función para realizar la alta lógica
async altaLogicaUsuarioTipo(id) {
    await conexion.execute('UPDATE usuariosTipo SET activo = 1 WHERE idUsuarioTipo = ?', [id]);
}


}


export default UsuariosTipoDB;
