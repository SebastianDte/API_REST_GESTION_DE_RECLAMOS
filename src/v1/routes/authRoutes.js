import express from 'express';
import authController from '../../controllers/authController.js'; // Ajusta la ruta según corresponda
// import passport from '../middlewares/passport.js'; // Importa passport si lo necesitas para la autenticación

const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', authController.login); // Se invoca la función login del controlador

router.post('/logout', authController.logout); // Ruta para cerrar sesión
export default router;