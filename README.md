# Cabin Booking API

API RESTful para sistema de reservas de cabañas.

## Autor
- Alduino

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones (base de datos, variables de entorno)
├── controllers/    # Controladores de la aplicación
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos de la base de datos
├── routes/         # Rutas de la API
├── services/       # Servicios y lógica de negocio
└── utils/          # Utilidades y helpers
```

## Requisitos

- Node.js >= 14
- MariaDB
- npm

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

## Documentación de la API

### Autenticación

#### Login
**URL**: `/auth/login`  
**Método**: `POST`

```json
// Request
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}

// Response (200 OK)
{
  "status": "success",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "role": "user"
  },
  "message": "Inicio de sesión exitoso"
}
```

#### Verificación de Token
**URL**: `/auth/verify-token`  
**Método**: `GET`

```
Headers: Authorization: Bearer jwt_token_here
```

### Usuarios

#### Registro
**URL**: `/users/register`  
**Método**: `POST`

```json
// Request
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario"
}

// Response (201 Created)
{
  "status": "success",
  "message": "Usuario registrado exitosamente"
}
```

#### Gestión de Usuarios
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario específico
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Cabañas

#### Gestión de Cabañas
- `GET /cabins` - Listar cabañas
- `GET /cabins/:id` - Obtener cabaña específica
- `POST /cabins` - Crear cabaña
- `PUT /cabins/:id` - Actualizar cabaña
- `DELETE /cabins/:id` - Eliminar cabaña

### Reservas

#### Gestión de Reservas
- `GET /bookings` - Listar reservas
- `GET /bookings/:id` - Obtener reserva específica
- `POST /bookings` - Crear reserva
- `PUT /bookings/:id` - Actualizar reserva
- `DELETE /bookings/:id` - Eliminar reserva

### Pagos

#### Gestión de Pagos
- `GET /payments` - Listar pagos
- `GET /payments/:id` - Obtener pago específico
- `POST /payments` - Crear pago
- `PUT /payments/:id` - Actualizar pago
- `DELETE /payments/:id` - Eliminar pago

### Imágenes

#### Gestión de Imágenes
- `GET /images` - Listar imágenes
- `GET /images/:id` - Obtener imagen específica
- `POST /images` - Subir imagen
- `PUT /images/:id` - Actualizar imagen
- `DELETE /images/:id` - Eliminar imagen

## Características

- ✅ Autenticación JWT
- ✅ Rate limiting
- ✅ Seguridad con Helmet
- ✅ Logging con Morgan
- ✅ Validación de datos
- ✅ Manejo de archivos con Multer
- ✅ Integración con AWS S3
- ✅ Generación de PDFs
- ✅ Envío de emails

## Implementación Frontend

### Manejo de Autenticación

```javascript
// Login
async function login(email, password) {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

// Verificar Token
async function verifyToken() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('/auth/verify-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en verificación de token:', error);
    throw error;
  }
}
```

### Consideraciones de Seguridad

1. **Manejo de Tokens**
   - Almacenar tokens en localStorage o cookies seguras
   - Implementar mecanismo de refresh token
   - Manejar tokens expirados

2. **Peticiones Autenticadas**
   - Incluir token en headers
   - Implementar interceptores para manejo de errores
   - Manejar sesiones expiradas

3. **Validación de Datos**
   - Validar datos en frontend
   - Mostrar mensajes de error apropiados
   - Implementar rate limiting en frontend

4. **UX**
   - Mostrar estados de carga
   - Implementar mensajes de error amigables
   - Manejar sesiones expiradas de forma elegante
