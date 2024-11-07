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

export const sendEmail = async (correoDestino, datos, tipo) => {
    // Validar el correo electrónico
    validarCorreo(correoDestino);

    const filename = fileURLToPath(import.meta.url);
    const dir = path.dirname(filename);

    let plantilla;
    try {
        // Determinar la ruta de la plantilla según el tipo de correo
        if (tipo === 'bienvenidaCliente') {
            // Plantilla para clientes
            plantilla = fs.readFileSync(path.join(dir, '../utils/handlebars/ClienteBienvenida.hbs'), 'utf-8');
        } else if (tipo === 'bienvenidaEmpleado') {
            // Plantilla para empleados
            plantilla = fs.readFileSync(path.join(dir, '../utils/handlebars/EmpleadoBienvenida.hbs'), 'utf-8');
        } 
        else if (tipo === 'olvidoPassword') {
            // Plantilla para olvido de contraseña
            plantilla = fs.readFileSync(path.join(dir, '/../utils/handlebars/OlvidoPassword.hbs'), 'utf-8');
        } else if (tipo === 'cambioEstadoReclamo') {
           
            plantilla = fs.readFileSync(path.join(dir, '../utils/handlebars/CambioEstadoReclamo.hbs'), 'utf-8');
        }
        else {
            throw new Error('Tipo de correo no reconocido');
        }
    } catch (error) {
        throw new Error('Error al leer la plantilla: ' + error.message);
    }

    const template = Handlebars.compile(plantilla);
    const correoHtml = template(datos);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CORREO,
            pass: process.env.CLAVE  
        }
    });

    // Definir asunto del correo según el tipo
    let asunto;
    if (tipo === 'bienvenidaCliente') {
        asunto = `¡Bienvenido como cliente, ${datos.nombre}!`;
    } else if (tipo === 'bienvenidaEmpleado') {
        asunto = `¡Bienvenido a la empresa, ${datos.nombre}!`;
    }else if (tipo === 'cambioEstadoReclamo') {
        
        asunto = `El estado de tu reclamo ha cambiado`;
    }
     else {
        asunto = "Recuperación de contraseña";
    }

    const mailOptions = {
        to: correoDestino,
        subject: asunto,
        html: correoHtml,
    };

    try {
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Error al enviar el correo: ' + error.message);
    }
};
