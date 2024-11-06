

import AuthService from '../services/authService.js'; // Asegúrate de ajustar la ruta

const login = async (req, res) => {
    const { correoElectronico, contrasenia } = req.body;
    try {
        const token = await AuthService.login(correoElectronico, contrasenia);

        // Guarda el token en una cookie
        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hora
        return res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Error en el servidor' });
    }
};

const logout = (req, res) => {
    // Elimina la cookie 'token'
    res.clearCookie('token', { httpOnly: true, secure: true });
    return res.json({ message: 'Cierre de sesión exitoso' });
};


export default {
    login,
    logout,
    
};
