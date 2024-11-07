import express from "express";
import passport from './middlewares/passport.js';
import dotenv from 'dotenv';
import v1Routes from './v1/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app=express();        
app.use(express.json());
app.use(cookieParser()); 
app.use(passport.initialize()); 

// Usa las rutas de la carpeta v1 con el prefijo /api/v1
app.use('/api/v1', v1Routes);  

// Configuración del puerto
const puerto = process.env.PUERTO;
app.listen(puerto,() =>{
    console.log(`estoy escuchando en ${puerto}`);
});