# API REST para Gestión de Reclamos

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**Autor:** Duarte Sebastián  

---

## Descripción

Esta API REST permite gestionar reclamos de manera eficiente y segura. Está diseñada para controlar la atención post-venta de una concesionaria de automóviles, asegurando que clientes, empleados y administradores puedan interactuar con el sistema según sus roles.  

El proyecto fue desarrollado con **Node.js** y **Express**, utilizando **MySQL** como base de datos relacional, y **Query Builder** para el manejo eficiente de las consultas y relaciones entre tablas.  

---

## Funcionalidades

### Clientes
- Autenticación mediante inicio de sesión.  
- Crear nuevos reclamos.  
- Consultar el estado y detalles de sus reclamos.  
- Recibir notificaciones sobre cambios en el estado de sus reclamos.  
- Cancelar reclamos en estado “creado”.  
- Actualizar su perfil.  

### Empleados
- Autenticación mediante inicio de sesión.  
- Atender reclamos y actualizar su estado.  
- Listar los reclamos asignados a su oficina.  

### Administradores
- Autenticación mediante inicio de sesión.  
- Gestionar tipos de reclamos (CRUD).  
- Gestionar empleados (CRUD).  
- Gestionar oficinas y asignación de empleados (CRUD).  
- Consultar información estadística sobre los reclamos mediante stored procedures.  
- Descargar informes en formato PDF o CSV.  

---

## Modelo de datos

- **Usuarios:** nombre, apellido, correo electrónico, contraseña, tipo de usuario (cliente, empleado, administrador), imagen.  
- **Oficinas:** nombre y usuarios asignados.  
- **Reclamos:** asunto, descripción, fecha de creación, fecha de finalización, fecha de cancelación (opcional), estado, tipo de reclamo, cliente que lo inicia, empleado que lo finaliza.  

Las relaciones entre estas entidades están definidas en la base de datos **MySQL**, asegurando integridad y eficiencia en las consultas.

---

## Tecnologías utilizadas

- **Backend:** Node.js / Express  
- **Base de datos:** MySQL  
- **Manejo de datos:** Query Builder  
- **Autenticación y seguridad:** JWT, encriptación de contraseñas  
- **Gestión de consultas complejas y relaciones:** Stored procedures y consultas optimizadas
