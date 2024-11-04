import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UsuarioDB from '../../db/usuariosDB.js'; // Asegúrate de ajustar esta ruta
import dotenv from 'dotenv';

dotenv.config();
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Esto extrae el token del encabezado de autorización
    secretOrKey: process.env.JWT_SECRET 
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const usuario = await UsuarioDB.obtenerUsuarioPorId(jwt_payload.id); // Ajusta esto según tu DB
        if (usuario) {
            return done(null, usuario);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;