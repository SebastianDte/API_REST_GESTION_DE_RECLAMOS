import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UsuariosDB from '../db/usuariosDB.js'; 
import dotenv from 'dotenv';

const usuariosDB = new UsuariosDB();

dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['token']; // lo dejo en token para desarrollo.
            }
            console.log('Token extraído:', token);
            return token;
        }
    ]),
    secretOrKey: process.env.JWT_SECRET,
};

// Estrategia JWT
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('Payload recibido:', jwt_payload);  // Verifica el contenido del payload recibido
    try {
        // Aquí no necesitas hacer una consulta a la base de datos,
        // ya que el 'idTipoUsuario' y otros datos ya están en el payload del token
        const usuario = {
            id: jwt_payload.id,  // Esto es opcional, si necesitas el ID
            idTipoUsuario: jwt_payload.idTipoUsuario  // Lo agregamos al objeto usuario
        };

        // Verificamos que el usuario tenga la propiedad 'idTipoUsuario'
        if (usuario && usuario.idTipoUsuario) {
            return done(null, usuario);  // Devuelves el objeto con 'idTipoUsuario' en req.user
        }
        return done(null, false);  // Si no está el 'idTipoUsuario', lo marcamos como falso
    } catch (error) {
        console.error('Error al obtener el usuario:', error);  // Depuración
        return done(error, false);  // Si hay un error, lo manejamos
    }
}));

// Middleware de autorización
const authorize = (...allowedTypes) => {
    return (req, res, next) => {
        const { idTipoUsuario } = req.user || {};  // Asegúrate de que req.user tenga el idTipoUsuario
        console.log('Tipo de usuario (idTipoUsuario):', idTipoUsuario);  // Verifica que esté llegando

        // Verifica si el tipo de usuario está incluido en los tipos permitidos
        if (allowedTypes.includes(idTipoUsuario)) {
            return next();  // El usuario tiene permiso
        }

        // Si no tiene permiso, devuelve un mensaje de acceso denegado
        return res.status(403).json({ message: 'Acceso denegado' });
    };
}


passport.authorize = authorize;

export default passport;
