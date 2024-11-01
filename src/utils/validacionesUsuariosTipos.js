
//Valida la descripción que no esté vacia.
const validarDescripcion = (descripcion) => {
    if (!descripcion || descripcion.trim() === "") {
        throw new Error("La descripción es requerida y no puede estar vacía.");
    }
};
//valida que no se pasen campos en el cuerpo como el ID o ACTIVO.
const validarSoloDescripcion = (body) => {
    const allowedFields = ['descripcion'];
    const receivedFields = Object.keys(body);
    
    // Comprobar si hay campos no permitidos
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        throw new Error(`Los siguientes campos no están permitidos: ${invalidFields.join(', ')}`);
    }
};
//valida que no existe otra descripción igual
const validarExistenciaDescripcion = async (descripcion, usuariosTipoDB) => {
    const tiposExistentes = await usuariosTipoDB.getAllUsuariosTipo();
    const existe = tiposExistentes.some(tipo => tipo.descripcion.toLowerCase() === descripcion.toLowerCase());
    if (existe) {
        throw new Error("Ya existe un tipo de usuario con esta descripción.");
    }
};

export { validarDescripcion, validarSoloDescripcion, validarExistenciaDescripcion };
