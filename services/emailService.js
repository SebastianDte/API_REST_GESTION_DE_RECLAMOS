import nodemailer from 'nodemailer';
import Handlebars from "handlebars"; 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Función para validar correo
const validarCorreo = (correo) => {
    const regex = /^(?!.*\.{2})(?!.*\.{3,})[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;
    if (!regex.test(correo)) {
        throw new Error('Correo electrónico no válido'); 
    }
};

// Función para enviar correo
export const sendEmail = async (correoDestino, datos) => {
    // Validar el correo electrónico
    validarCorreo(correoDestino); // Se valida antes de proceder

    // Obtener la ruta del módulo actual y la convierte en una ruta de archivo.
    const filename = fileURLToPath(import.meta.url);
    // Obtener el directorio donde se encuentra el archivo actual, para construir rutas relativas.
    const dir = path.dirname(filename);
    
    // Lee la plantilla que le paso por la ruta, en este caso concatenando el directorio + la ruta donde esta la plantilla
    // Aclarando que lo quiero en formato utf-8
    let plantilla;
    try {
        plantilla = fs.readFileSync(path.join(dir + '/../utils/hadlebars/plantilla.hbs'), 'utf-8');
    } catch (error) {
        throw new Error('Error al leer la plantilla: ' + error.message); // Manejo de errores al leer la plantilla
    }

    // Compila la plantilla del correo
    const template = Handlebars.compile(plantilla);
    // Para insertar los datos en la plantilla
    const correoHtml = template(datos);
    
    // Creamos el transporter, es la información del remitente, o sea yo el que envía los mails.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CORREO,
            pass: process.env.CLAVE  
        }
    });
    
    // Opciones para enviar el correo electrónico
    const mailOptions = {
        to: correoDestino,
        subject: "NOTIFICACION",
        html: correoHtml,
    };

    // Envía el correo y maneja el resultado
    try {
        return await transporter.sendMail(mailOptions); // Espera a que se envíe el correo
    } catch (error) {
        throw new Error('Error al enviar el correo: ' + error.message); // Manejo de errores al enviar el correo
    }
};