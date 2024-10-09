import express from "express";
import dotenv from 'dotenv';
import { sendEmail } from './services/emailController.js'; // Importa la función
import v1Routes from './v1/index.js';

//No tocar !!!
dotenv.config();
const app=express();        
app.use(express.json());



// Prefijo para la versión v1
app.use('/api/v1', v1Routes);  // Usa las rutas de la carpeta v1 con el prefijo /api/v1

//Envio de correo - NO VA ACÁ, PERO ANDA, LUEGO LO ORDENO.
app.post('/notificacion', async (req, res) => {
    console.log("Ruta /notificacion alcanzada");
    // Es quien va a recibir el correo, a donde se va a mandar se toma del cuerpo del json.
    const correoDestino = req.body.correoElectronico;
    try {
        const datos = { nombre: 'fulano', reclamo: '1234' };
        await sendEmail(correoDestino, datos);
        console.log("Correo enviado con exito");
        res.send(true);
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(400).send({ error: error.message }); // Respuesta de error al cliente
    }
});


// Configuración del puerto
const puerto = process.env.PUERTO;
app.listen(puerto,() =>{
    console.log(`estoy escuchando en ${puerto}`);
});