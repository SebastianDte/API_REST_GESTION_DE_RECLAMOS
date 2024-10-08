import mysql from 'mysql2/promise';

//crear funcion para la conexion a la db

export const conexion = await mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'reclamos',
    password:''
});