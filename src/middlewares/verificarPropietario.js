export const verificarPropietario = (req, res, next) => {
    const { idUsuario } = req.params; // Obtengo el ID de la ruta
    const { idUsuario: id } = req.user; // Cambio el ID por ID usuario, para hacer el match

    // Verifico que el ID que quiere modificar sea el de el, y no quiera tirar fruta
    if (parseInt(idUsuario) !== parseInt(id)) {
        return res.status(403).json({ mensaje: 'No tienes permiso para actualizar este usuario.' });
    }

    // Si todo está bien, sigue de largo
    next();
};