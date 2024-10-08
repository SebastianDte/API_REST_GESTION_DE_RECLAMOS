import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno

// Crear función para la conexión a la DB
export const conexion = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME,
    port: process.env.DB_PORT // Si no lo especificas, usa el puerto por defecto
});
