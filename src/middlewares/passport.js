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
    console.log('Payload recibido:', jwt_payload);  
    try {
        
        const usuario = {
            id: jwt_payload.id,  
            idTipoUsuario: jwt_payload.idTipoUsuario  
        };

        
        if (usuario && usuario.idTipoUsuario) {
            return done(null, usuario);  
        }
        return done(null, false);  
    } catch (error) {
        console.error('Error al obtener el usuario:', error);  
        return done(error, false);  
    }
}));

// Middleware de autorización
const authorize = (...allowedTypes) => {
    return (req, res, next) => {
        const { idTipoUsuario } = req.user || {};  
        console.log('Tipo de usuario (idTipoUsuario):', idTipoUsuario); 

        
        if (allowedTypes.includes(idTipoUsuario)) {
            return next();  
        }

       
        return res.status(403).json({ message: 'Acceso denegado' });
    };
}


passport.authorize = authorize;

export default passport;
