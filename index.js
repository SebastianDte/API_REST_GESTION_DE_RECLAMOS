import express from "express";
import dotenv from 'dotenv';
import { sendEmail } from './services/emailService.js'; // Importa la función


//Lee las variables de entorno.
dotenv.config();
const app=express();

app.use(express.json());

//para probar que esta escuchando mi api y recibe el get.
app.get('/',(req,res)=>{
    res.json({'estado':true});
});

 
// Ruta para recibir y enviar correo electrónico.
app.post('/notificacion', async (req, res) => {
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

//Variable de entorno Puerto, para ver que esta escuchando en el puerto que configuramos en las variables de entorno.
const puerto = process.env.PUERTO;
app.listen(puerto,() =>{
    console.log(`estoy escuchando en ${puerto}`);
});