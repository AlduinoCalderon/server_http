# Cabin Booking API

API RESTful para sistema de reservas de cabañas.

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones (base de datos, variables de entorno)
├── controllers/    # Controladores de la aplicación
├── middleware/     # Middlewares personalizados
├── models/         # Modelos de la base de datos
├── routes/         # Rutas de la API
├── services/       # Servicios y lógica de negocio
└── utils/          # Utilidades y helpers
```

## Requisitos

- Node.js >= 14
- MariaDB
- npm o yarn

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   - Configurar las variables necesarias

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm start
```

## Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
  ```json
  {
    "first_name": "Nombre",
    "last_name": "Apellido",
    "email": "usuario@ejemplo.com",
    "password": "contraseña123",
    "telefono": "1234567890"
  }
  ```
- `POST /api/auth/login` - Inicio de sesión
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```
- `GET /api/auth/profile` - Obtener perfil del usuario (requiere autenticación)

### Otros Endpoints
- `GET /api/health` - Health check
- `GET /api/users` - Gestión de usuarios
- `GET /api/cabins` - Gestión de cabañas
- `GET /api/bookings` - Gestión de reservas
- `GET /api/payments` - Gestión de pagos
- `GET /api/images` - Gestión de imágenes

## Características

- ✅ Autenticación JWT
- ✅ Rate limiting
- ✅ Seguridad con Helmet
- ✅ Logging con Morgan
- ✅ Validación de datos
- ✅ Manejo de archivos con Multer
- ✅ Integración con AWS S3
- ✅ Generación de PDFs
- ✅ Envío de emails con SendGrid

## Autor

**AlduinoCalderon** - [GitHub](https://github.com/AlduinoCalderon)
