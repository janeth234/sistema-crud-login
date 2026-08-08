# Sistema CRUD + Login

Sistema web para la administración de usuarios mediante operaciones CRUD y autenticación.

## Funcionalidades

- Inicio de sesión
- Autenticación mediante JWT
- Protección de rutas
- Registro de usuarios
- Listado de usuarios
- Edición de usuarios
- Eliminación de usuarios
- Cierre de sesión

## Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express
- TypeScript
- JWT
- bcrypt
- Zod
- Drizzle ORM

### Base de datos
- PostgreSQL

## Credenciales de prueba

Utilizar las siguientes credenciales para ingresar al sistema:

**Usuario:** usuario@correo.com  
**Contraseña:** Prueba2026

## Estructura del proyecto

- `backend/` - API REST, autenticación y conexión con PostgreSQL.
- `frontend/` - Interfaz web del sistema.
- `postman/` - Colección de pruebas de la API.

## Ejecutar Backend

Abrir una terminal:

```bash
cd backend
npm install
npm run dev