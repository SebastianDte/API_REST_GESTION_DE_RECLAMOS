import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UsuariosDB from '../db/usuariosDB.js'; // Asegúrate de ajustar esta ruta
import dotenv from 'dotenv';

const usuariosDB = new UsuariosDB();

dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['token']; // Cambia 'token' por el nombre de tu cookie
            }
            return token;
        }
    ]),
    secretOrKey: process.env.JWT_SECRET,
};

// Estrategia JWT
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('Payload recibido:', jwt_payload); // payload del JWT
    try {
        const usuario = await usuariosDB.obtenerUsuarioPorId(jwt_payload.id); 
        console.log('Usuario obtenido:', usuario); 
        if (usuario) {
            return done(null, usuario); // Esto debería pasar el usuario a req.user
        }
        return done(null, false); // Si no se encuentra el usuario
    } catch (error) {
        console.error('Error al obtener el usuario:', error); // Log del error para depuración
        return done(error, false); // Manejo del error
    }
}));

// Middleware de autorización
const authorize = (...allowedTypes) => {
    return (req, res, next) => {
        console.log('Usuario autenticado:', req.user);
        const { tipoUsuario } = req.user || {}; 
        console.log('Tipo de usuario:', tipoUsuario); 
        
        // Verifica si el tipo de usuario está incluido en los tipos permitidos
        if (allowedTypes.includes(tipoUsuario)) {
            return next(); // El usuario tiene permiso
        }
        
        // Si no tiene permiso, devuelve un mensaje de acceso denegado
        return res.status(403).json({ message: 'Acceso denegado' });
    };
};


passport.authorize = authorize;

export default passport;
