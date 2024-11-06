import bcrypt from 'bcrypt';

const password = 'pruebas'; // La contraseña en texto plano que usarás para el admin
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log('Contraseña hasheada:', hash); // Copia el hash que te devuelve
});
