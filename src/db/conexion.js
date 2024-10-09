import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

//Esto es para cargar las variables de entorno.
dotenv.config();

// Creo la función para conexión a la database.
//No creo usuario ni contraseña, para facilitar la configuración al ejecutar el proyecto en distintas maquinas,
//Como trabajamos de forma local, utilizando la configuración estandar no hay problemas para nadie.

export const conexion = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',  //Estoy trabajando de forma local
    user: process.env.DB_USER || 'root',  //Usuario ROOT por defecto.
    password: process.env.DB_PASSWORD || '',  //Sin contraseña
    database: process.env.DB_NAME,
    port: process.env.DB_PORT 
});
