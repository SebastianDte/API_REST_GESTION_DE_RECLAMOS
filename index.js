import express from "express";
import dotenv from 'dotenv';
import { sendEmail } from './services/emailService.js'; // Importa la función
import { conexion } from "./db/conexion.js";

//Lee las variables de entorno.
dotenv.config();
const app=express();

app.use(express.json());

//para probar que esta escuchando mi api y recibe el get.
// app.get('/',(req,res)=>{
//     res.json({'estado':true});
// });

app.get('/reclamos-estados/:idReclamoEstado',async(req,res)=>{
    try {
        const idReclamoEstado=req.params.idReclamoEstado;
        const sql = 'select estado, id,decripcion from reclamosestados where id = ?;'
        const [result] = await conexion.query(sql,[idReclamoEstado]);
        //console.log(result)
        if(!result.length!=0){
            return res.status(400).json({
                message:"No se encontre el estado."  
            })
        };
        
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Error interno."
        })
    }
})

// Ruta para update usando path
app.patch('/reclamos-estados/:idReclamoEstado',async(req,res)=>{

    try {
        const {descripcion,activo} = req.body;
        if(!descripcion){
            return res.status(404).json({
                message:"Se requiero el campo descripción."
            })
        }
        
        if(activo == undefined || activo ===null){
            return res.status(404).json({
                message:"Se requiero el campo descripción."
            })
        };

        const idReclamoEstado=req.params.idReclamoEstado;
        const sql='update reclamosestados set decripcion=?,estado=? where id=? ';
        const result = await conexion.query(sql,[descripcion,activo,idReclamoEstado]);

        if(result.affectedRows===0){
            return res.status(404).json({
                message:"No se pudo moficiar."
            })

        }
        res.status(200).json({
            message:"Reclamo modificado con exito"
        });
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Error interno."
        })
    }


}) 

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


app.post('/reclamos-estados/:idReclamoEstado',async(req,res)=>{

    try {
        const {descripcion,activo} = req.body;
        if(!descripcion){
            return res.status(404).json({
                message:"Se requiero el campo descripción."
            })
        }
        
        if(activo == undefined || activo ===null){
            return res.status(404).json({
                message:"Se requiero el campo descripción."
            })
        };

        const idReclamoEstado=req.params.idReclamoEstado;
        const sql='update reclamosestados set decripcion=?,estado=? where id=? ';
        const result = await conexion.query(sql,[descripcion,activo,idReclamoEstado]);

        if(result.affectedRows===0){
            return res.status(404).json({
                message:"No se pudo moficiar."
            })

        }
        res.status(200).json({
            message:"Reclamo modificado con exito"
        });
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Error interno."
        })
    }


}) 

//Variable de entorno Puerto, para ver que esta escuchando en el puerto que configuramos en las variables de entorno.
const puerto = process.env.PUERTO;
app.listen(puerto,() =>{
    console.log(`estoy escuchando en ${puerto}`);
});