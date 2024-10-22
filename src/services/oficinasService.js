import OficinasDB from './OficinasDB.js';

class OficinasService {
  constructor() {
    this.oficinasDB = new OficinasDB(); 
  }

  async obtenerOficinas(filtros) {
    try {
      const oficinas = await this.oficinasDB.obtenerOficinas(filtros);
      return oficinas;
    } catch (error) {
      throw new Error('Error al obtener las oficinas'); // Manejo de errores
    }
  }
}

export default OficinasService;