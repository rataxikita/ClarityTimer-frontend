# 🔌 Documento de APIs e Integración - ClarityTimer

**Versión:** 1.0  
**Fecha:** Noviembre 2025
**Proyecto:** ClarityTimer - Temporizador Pomodoro con Gamificación

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Información General de la API](#información-general-de-la-api)
3. [Autenticación](#autenticación)
4. [Endpoints por Módulo](#endpoints-por-módulo)
5. [Flujos de Integración](#flujos-de-integración)
6. [Manejo de Errores](#manejo-de-errores)
7. [Swagger/OpenAPI](#swaggeropenapi)
8. [Mejores Prácticas](#mejores-prácticas)
9. [Ejemplos de Integración](#ejemplos-de-integración)

---

## 1. Introducción

### 1.1 Propósito del Documento

Este documento describe la API REST de ClarityTimer, incluyendo todos los endpoints disponibles, ejemplos de uso, flujos de integración y mejores prácticas para desarrolladores que deseen integrarse con el sistema.

### 1.2 Arquitectura

ClarityTimer utiliza una arquitectura REST API con las siguientes características:

- **Backend**: Spring Boot 3.5.7 con Java 17
- **Base de Datos**: MySQL 8.0+
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: Swagger/OpenAPI 3.0
- **Formato de Datos**: JSON
- **CORS**: Habilitado para desarrollo

### 1.3 Convenciones

- **Base URL**: `http://localhost:8080/api/v1`
- **Métodos HTTP**: GET, POST, PUT, DELETE
- **Formato de Respuesta**: JSON
- **Códigos HTTP**: Estándar REST

---

## 2. Información General de la API

### 2.1 Base URL

```
http://localhost:8080/api/v1
```

### 2.2 Versión

**Versión Actual**: v1  
**Formato**: `/api/v1/{recurso}`

### 2.3 Headers Requeridos

#### Para Endpoints Públicos

```http
Content-Type: application/json
```

#### Para Endpoints Protegidos

```http
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

### 2.4 Formato de Respuesta

Todas las respuestas exitosas devuelven JSON con el siguiente formato:

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "username": "usuario",
  "email": "usuario@example.com",
  ...
}
```

**Respuesta de Lista (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Hello Kitty",
    ...
  },
  {
    "id": 2,
    "nombre": "My Melody",
    ...
  }
]
```

**Respuesta de Error (4xx/5xx):**
```json
{
  "message": "Descripción del error",
  "status": 400,
  "timestamp": "2024-12-26T21:00:00"
}
```

### 2.5 Códigos de Estado HTTP

| Código | Descripción | Uso |
|--------|-------------|-----|
| **200** | OK | Operación exitosa |
| **201** | Created | Recurso creado exitosamente |
| **204** | No Content | Operación exitosa sin contenido |
| **400** | Bad Request | Solicitud inválida |
| **401** | Unauthorized | Token inválido o ausente |
| **403** | Forbidden | Sin permisos para el recurso |
| **404** | Not Found | Recurso no encontrado |
| **500** | Internal Server Error | Error del servidor |

---

## 3. Autenticación

### 3.1 Sistema de Autenticación

ClarityTimer utiliza **JWT (JSON Web Tokens)** para autenticación. El flujo es el siguiente:

1. Usuario se registra o inicia sesión
2. Backend valida credenciales
3. Backend genera un token JWT
4. Frontend almacena el token
5. Frontend incluye el token en todas las peticiones protegidas
6. Backend valida el token en cada petición

### 3.2 Endpoints de Autenticación

#### 3.2.1 Registrar Usuario

**Endpoint**: `POST /api/v1/auth/register`

**Descripción**: Crea un nuevo usuario en el sistema

**Headers**:
```http
Content-Type: application/json
```

**Body**:
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@example.com",
  "password": "contraseña123",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

**Validaciones**:
- `username`: Requerido, único, mínimo 3 caracteres
- `email`: Requerido, único, formato válido
- `password`: Requerido, mínimo 6 caracteres
- `nombre`: Opcional
- `apellido`: Opcional

**Respuesta Exitosa (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "username": "nuevo_usuario",
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "CLIENTE",
    "puntosTotales": 600,
    "puntosDisponibles": 600,
    "streakDias": 0,
    "activo": true,
    "fechaRegistro": "2024-12-26T21:00:00"
  }
}
```

**Beneficios al Registrarse**:
- 🎁 600 puntos de bienvenida
- 🎭 Personaje Cinnamoroll gratis
- 👤 Rol CLIENTE por defecto

**Errores Posibles**:
- `400 Bad Request`: Username o email ya existe
- `400 Bad Request`: Validación fallida

**Ejemplo cURL**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "email": "usuario@example.com",
    "password": "contraseña123",
    "nombre": "Juan",
    "apellido": "Pérez"
  }'
```

#### 3.2.2 Iniciar Sesión

**Endpoint**: `POST /api/v1/auth/login`

**Descripción**: Autentica un usuario existente

**Headers**:
```http
Content-Type: application/json
```

**Body**:
```json
{
  "username": "usuario_existente",
  "password": "contraseña123"
}
```

**Validaciones**:
- `username`: Requerido (puede ser username o email)
- `password`: Requerido

**Respuesta Exitosa (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "username": "usuario_existente",
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "CLIENTE",
    "puntosTotales": 1250,
    "puntosDisponibles": 800,
    "streakDias": 5,
    "activo": true,
    "fechaRegistro": "2024-12-20T10:00:00"
  }
}
```

**Errores Posibles**:
- `401 Unauthorized`: Credenciales inválidas
- `400 Bad Request`: Validación fallida

**Ejemplo cURL**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario_existente",
    "password": "contraseña123"
  }'
```

#### 3.2.3 Obtener Usuario Actual

**Endpoint**: `GET /api/v1/auth/me`

**Descripción**: Obtiene la información del usuario autenticado

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": 1,
  "username": "usuario_existente",
  "email": "usuario@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "CLIENTE",
  "puntosTotales": 1250,
  "puntosDisponibles": 800,
  "streakDias": 5,
  "personajeActivoId": 1,
  "personajeActivoNombre": "Cinnamoroll",
  "activo": true,
  "fechaRegistro": "2024-12-20T10:00:00"
}
```

**Errores Posibles**:
- `401 Unauthorized`: Token inválido o expirado
- `404 Not Found`: Usuario no encontrado

**Ejemplo cURL**:
```bash
curl -X GET http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3.3 Uso del Token JWT

**Duración del Token**: 24 horas

**Almacenamiento Recomendado**: `localStorage` (frontend)

**Inclusión en Peticiones**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Ejemplo en JavaScript (Axios)**:
```javascript
axios.get('/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
```

---

## 4. Endpoints por Módulo

### 4.1 Módulo de Personajes

#### 4.1.1 Listar Todos los Personajes (Público)

**Endpoint**: `GET /api/v1/personajes`

**Descripción**: Obtiene todos los personajes disponibles (solo los que tienen `disponible=true`)

**Headers**: Ninguno requerido (público)

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": 1,
    "nombre": "Cinnamoroll",
    "descripcion": "Un perro blanco y esponjoso",
    "categoria": {
      "id": 1,
      "nombre": "Común",
      "color": "#95a5a6"
    },
    "precioPuntos": 0,
    "rareza": "COMUN",
    "imagenEstudio": "/characters/cinnamoroll-study.png",
    "imagenDescanso": "/characters/cinnamoroll-break.png",
    "disponible": true,
    "esDefault": true
  },
  {
    "id": 2,
    "nombre": "Hello Kitty",
    "descripcion": "La gatita rosa más famosa",
    "categoria": {
      "id": 1,
      "nombre": "Común",
      "color": "#95a5a6"
    },
    "precioPuntos": 100,
    "rareza": "COMUN",
    "imagenEstudio": "/characters/hello-kitty-study.png",
    "imagenDescanso": "/characters/hello-kitty-break.png",
    "disponible": true,
    "esDefault": false
  }
]
```

#### 4.1.2 Listar Todos los Personajes (Admin/Vendedor)

**Endpoint**: `GET /api/v1/personajes/admin/all`

**Descripción**: Obtiene TODOS los personajes, incluyendo los no disponibles

**Permisos**: ADMIN, VENDEDOR

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta**: Similar a `/api/v1/personajes` pero incluye personajes con `disponible=false`

#### 4.1.3 Obtener Personaje por ID

**Endpoint**: `GET /api/v1/personajes/{id}`

**Descripción**: Obtiene un personaje específico por su ID

**Headers**: Ninguno requerido (público)

**Parámetros**:
- `id` (path): ID del personaje

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": 1,
  "nombre": "Cinnamoroll",
  "descripcion": "Un perro blanco y esponjoso",
  "categoria": {
    "id": 1,
    "nombre": "Común",
    "color": "#95a5a6"
  },
  "precioPuntos": 0,
  "rareza": "COMUN",
  "imagenEstudio": "/characters/cinnamoroll-study.png",
  "imagenDescanso": "/characters/cinnamoroll-break.png",
  "disponible": true,
  "esDefault": true
}
```

#### 4.1.4 Obtener Personajes Disponibles para Comprar

**Endpoint**: `GET /api/v1/personajes/disponibles`

**Descripción**: Obtiene personajes que el usuario puede comprar (no los tiene y están disponibles)

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta**: Lista de personajes disponibles para comprar

#### 4.1.5 Obtener Personajes Desbloqueados (Inventario)

**Endpoint**: `GET /api/v1/personajes/desbloqueados`

**Descripción**: Obtiene el inventario del usuario (personajes que ha comprado)

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 1,
      "username": "usuario"
    },
    "personaje": {
      "id": 1,
      "nombre": "Cinnamoroll"
    },
    "esActivo": true,
    "fechaObtencion": "2024-12-20T10:00:00",
    "puntosGastados": 0,
    "vecesUsado": 15
  }
]
```

#### 4.1.6 Comprar Personaje

**Endpoint**: `POST /api/v1/personajes/{id}/comprar`

**Descripción**: Compra un personaje con puntos del usuario

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Parámetros**:
- `id` (path): ID del personaje a comprar

**Respuesta Exitosa (200 OK)**:
```json
{
  "mensaje": "Personaje comprado exitosamente",
  "personaje": {
    "id": 2,
    "nombre": "Hello Kitty"
  },
  "puntosGastados": 100,
  "puntosDisponiblesRestantes": 500,
  "codigoCertificado": "CERT-ABC12345"
}
```

**Errores Posibles**:
- `400 Bad Request`: No tienes puntos suficientes
- `400 Bad Request`: Personaje no disponible
- `400 Bad Request**: Ya tienes este personaje
- `404 Not Found`: Personaje no encontrado

#### 4.1.7 Activar Personaje

**Endpoint**: `PUT /api/v1/personajes/{id}/activar`

**Descripción**: Activa un personaje del inventario del usuario

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Parámetros**:
- `id` (path): ID del personaje a activar

**Respuesta Exitosa (200 OK)**: Sin contenido (204)

**Errores Posibles**:
- `404 Not Found`: Personaje no encontrado en tu inventario

#### 4.1.8 Actualizar Personaje (Admin)

**Endpoint**: `PUT /api/v1/personajes/{id}`

**Descripción**: Actualiza precio y disponibilidad de un personaje

**Permisos**: ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Body**:
```json
{
  "precioPuntos": 150,
  "disponible": true
}
```

**Respuesta Exitosa (200 OK)**: Personaje actualizado

#### 4.1.9 Obtener Historial de Adopciones (Admin/Vendedor)

**Endpoint**: `GET /api/v1/personajes/admin/adopciones`

**Descripción**: Obtiene todas las compras de personajes (adopciones)

**Permisos**: ADMIN, VENDEDOR

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta**: Lista de todas las adopciones

### 4.2 Módulo de Sesiones

#### 4.2.1 Crear Sesión

**Endpoint**: `POST /api/v1/sesiones`

**Descripción**: Crea una nueva sesión Pomodoro

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body**:
```json
{
  "fecha": "2024-12-26",
  "tipoPomodoro": "TRABAJO",
  "duracionMinutos": 25,
  "detalles": [
    {
      "fase": "TRABAJO",
      "duracionMinutos": 25,
      "completada": false
    }
  ]
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": 1,
  "usuario": {
    "id": 1,
    "username": "usuario"
  },
  "fecha": "2024-12-26",
  "tipoPomodoro": "TRABAJO",
  "duracionMinutos": 25,
  "completada": false,
  "puntosGanados": 0
}
```

#### 4.2.2 Obtener Mis Sesiones

**Endpoint**: `GET /api/v1/sesiones`

**Descripción**: Obtiene todas las sesiones del usuario autenticado

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": 1,
    "fecha": "2024-12-26",
    "tipoPomodoro": "TRABAJO",
    "duracionMinutos": 25,
    "completada": true,
    "puntosGanados": 10
  }
]
```

#### 4.2.3 Obtener Sesión por ID

**Endpoint**: `GET /api/v1/sesiones/{id}`

**Descripción**: Obtiene una sesión específica

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

#### 4.2.4 Completar Sesión

**Endpoint**: `POST /api/v1/sesiones/{id}/completar`

**Descripción**: Marca una sesión como completada y otorga puntos si es de trabajo

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**: Sin contenido (204)

**Efectos**:
- Si `tipoPomodoro = TRABAJO`: +10 puntos al usuario
- Actualiza `puntosTotales` y `puntosDisponibles`
- Registra en historial de puntos

#### 4.2.5 Eliminar Sesión

**Endpoint**: `DELETE /api/v1/sesiones/{id}`

**Descripción**: Elimina una sesión

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (204 No Content)**

### 4.3 Módulo de Notas

#### 4.3.1 Obtener Mis Notas

**Endpoint**: `GET /api/v1/notas`

**Descripción**: Obtiene todas las notas del usuario autenticado

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": 1,
    "titulo": "Recordatorio importante",
    "contenido": "Estudiar capítulo 5",
    "categoria": "ESTUDIO",
    "completada": false,
    "fijada": true,
    "fechaCreacion": "2024-12-26T10:00:00"
  }
]
```

#### 4.3.2 Crear Nota

**Endpoint**: `POST /api/v1/notas`

**Descripción**: Crea una nueva nota

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body**:
```json
{
  "titulo": "Nueva nota",
  "contenido": "Contenido de la nota",
  "categoria": "ESTUDIO",
  "completada": false,
  "fijada": false
}
```

**Categorías Disponibles**:
- `GENERAL`
- `ESTUDIO`
- `DESCANSO`
- `IDEAS`
- `TAREAS`

**Respuesta Exitosa (200 OK)**: Nota creada

#### 4.3.3 Actualizar Nota

**Endpoint**: `PUT /api/v1/notas/{id}`

**Descripción**: Actualiza una nota existente

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body**: Similar a crear nota

#### 4.3.4 Eliminar Nota

**Endpoint**: `DELETE /api/v1/notas/{id}`

**Descripción**: Elimina una nota

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**: Sin contenido

### 4.4 Módulo de Estadísticas

#### 4.4.1 Obtener Historial de Puntos

**Endpoint**: `GET /api/v1/estadisticas/puntos/historial`

**Descripción**: Obtiene el historial de transacciones de puntos del usuario

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": 1,
    "tipo": "GANADO",
    "cantidad": 10,
    "descripcion": "Pomodoro completado",
    "fecha": "2024-12-26T10:00:00"
  },
  {
    "id": 2,
    "tipo": "GASTADO",
    "cantidad": -100,
    "descripcion": "Compra de Hello Kitty",
    "fecha": "2024-12-25T15:30:00"
  }
]
```

**Tipos de Transacción**:
- `GANADO`: Puntos ganados
- `GASTADO`: Puntos gastados
- `REGALO`: Puntos de regalo (bienvenida)

#### 4.4.2 Obtener Mi Progreso

**Endpoint**: `GET /api/v1/estadisticas/mi-progreso`

**Descripción**: Obtiene estadísticas de progreso del usuario

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "puntosTotales": 1250,
  "puntosDisponibles": 800,
  "streakDias": 5,
  "fechaUltimaSesion": "2024-12-26"
}
```

#### 4.4.3 Obtener Ranking

**Endpoint**: `GET /api/v1/estadisticas/ranking`

**Descripción**: Obtiene el top 10 de usuarios con más puntos

**Permisos**: CLIENTE, VENDEDOR, ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": 5,
    "username": "top_user",
    "puntosTotales": 5000,
    "streakDias": 30
  },
  {
    "id": 1,
    "username": "usuario",
    "puntosTotales": 1250,
    "streakDias": 5
  }
]
```

### 4.5 Módulo de Usuarios (Admin)

#### 4.5.1 Listar Todos los Usuarios

**Endpoint**: `GET /api/v1/usuarios/admin/all`

**Descripción**: Obtiene todos los usuarios del sistema

**Permisos**: ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": 1,
    "username": "usuario1",
    "email": "usuario1@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "CLIENTE",
    "puntosTotales": 1250,
    "puntosDisponibles": 800,
    "streakDias": 5,
    "activo": true,
    "fechaRegistro": "2024-12-20T10:00:00"
  }
]
```

#### 4.5.2 Obtener Usuario por ID

**Endpoint**: `GET /api/v1/usuarios/admin/{id}`

**Descripción**: Obtiene un usuario específico

**Permisos**: ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

#### 4.5.3 Actualizar Rol de Usuario

**Endpoint**: `PUT /api/v1/usuarios/admin/{id}/rol`

**Descripción**: Cambia el rol de un usuario

**Permisos**: ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body**:
```json
{
  "rol": "VENDEDOR"
}
```

**Roles Disponibles**:
- `CLIENTE`
- `VENDEDOR`
- `ADMIN`

**Respuesta Exitosa (200 OK)**: Usuario actualizado

#### 4.5.4 Activar/Desactivar Usuario

**Endpoint**: `PUT /api/v1/usuarios/admin/{id}/activo`

**Descripción**: Activa o desactiva un usuario

**Permisos**: ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta Exitosa (200 OK)**: Usuario actualizado

#### 4.5.5 Eliminar Usuario

**Endpoint**: `DELETE /api/v1/usuarios/admin/{id}`

**Descripción**: Elimina un usuario del sistema

**Permisos**: ADMIN

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
```

**Validaciones**:
- No se puede eliminar el último ADMIN activo

**Respuesta Exitosa (204 No Content)**

---

## 5. Flujos de Integración

### 5.1 Flujo de Registro e Inicio de Sesión

```
1. Usuario → POST /auth/register
   ↓
2. Backend valida datos
   ↓
3. Backend crea usuario + 600 puntos + Cinnamoroll
   ↓
4. Backend genera JWT token
   ↓
5. Frontend recibe token y lo almacena
   ↓
6. Frontend incluye token en peticiones siguientes
```

### 5.2 Flujo de Compra de Personaje

```
1. Usuario → GET /personajes/disponibles
   ↓
2. Frontend muestra personajes disponibles
   ↓
3. Usuario selecciona personaje → POST /personajes/{id}/comprar
   ↓
4. Backend valida:
   - Usuario tiene puntos suficientes
   - Personaje está disponible
   - Usuario no tiene el personaje
   ↓
5. Backend:
   - Descuenta puntos
   - Agrega personaje al inventario
   - Genera certificado
   ↓
6. Frontend actualiza UI con nuevo personaje
```

### 5.3 Flujo de Completar Pomodoro

```
1. Usuario inicia temporizador (frontend)
   ↓
2. Al completar → POST /sesiones
   ↓
3. Backend crea sesión
   ↓
4. Usuario completa → POST /sesiones/{id}/completar
   ↓
5. Backend:
   - Si tipoPomodoro = TRABAJO: +10 puntos
   - Actualiza puntosTotales y puntosDisponibles
   - Registra en historial
   ↓
6. Frontend actualiza puntos en UI
```

### 5.4 Flujo de Gestión de Usuarios (Admin)

```
1. Admin → GET /usuarios/admin/all
   ↓
2. Frontend muestra lista de usuarios
   ↓
3. Admin edita rol → PUT /usuarios/admin/{id}/rol
   ↓
4. Backend actualiza rol
   ↓
5. Frontend actualiza UI
```

---

## 6. Manejo de Errores

### 6.1 Errores Comunes

#### 401 Unauthorized

**Causa**: Token inválido, expirado o ausente

**Solución**:
```javascript
// Frontend debe redirigir al login
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

#### 403 Forbidden

**Causa**: Usuario no tiene permisos para el recurso

**Ejemplo**:
```json
{
  "message": "Acceso denegado. Se requiere rol ADMIN",
  "status": 403
}
```

#### 400 Bad Request

**Causa**: Datos inválidos en la petición

**Ejemplo**:
```json
{
  "message": "No tienes puntos suficientes para comprar este personaje",
  "status": 400
}
```

#### 404 Not Found

**Causa**: Recurso no encontrado

**Ejemplo**:
```json
{
  "message": "Personaje no encontrado con ID: 999",
  "status": 404
}
```

### 6.2 Manejo de Errores en Frontend

**Ejemplo con Axios Interceptor**:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Swagger/OpenAPI

### 7.1 Acceso a Swagger UI

**URL**: `http://localhost:8080/swagger-ui/index.html`

### 7.2 Información de la API

- **Título**: ClarityTimer API
- **Versión**: 1.0.0
- **Descripción**: API REST para aplicación Pomodoro con sistema de gamificación mediante puntos canjeables por personajes Sanrio
- **Servidor**: `http://localhost:8080`

### 7.3 Características de Swagger

- ✅ Documentación interactiva de todos los endpoints
- ✅ Pruebas de endpoints directamente desde el navegador
- ✅ Autenticación JWT integrada
- ✅ Ejemplos de requests y responses
- ✅ Esquemas de datos

### 7.4 Uso de Swagger

1. Abre `http://localhost:8080/swagger-ui/index.html`
2. Haz clic en "Authorize" (🔒)
3. Ingresa tu token JWT: `Bearer {tu_token}`
4. Explora los endpoints disponibles
5. Prueba endpoints directamente desde la interfaz

---

## 8. Mejores Prácticas

### 8.1 Autenticación

- ✅ **Siempre incluye el token** en peticiones protegidas
- ✅ **Almacena el token** de forma segura (localStorage para web)
- ✅ **Maneja tokens expirados** redirigiendo al login
- ✅ **No expongas el token** en logs o URLs

### 8.2 Peticiones HTTP

- ✅ **Usa métodos HTTP correctos**: GET para leer, POST para crear, PUT para actualizar, DELETE para eliminar
- ✅ **Incluye headers apropiados**: Content-Type, Authorization
- ✅ **Valida datos** antes de enviar peticiones
- ✅ **Maneja errores** apropiadamente

### 8.3 Performance

- ✅ **Cachea respuestas** cuando sea apropiado
- ✅ **Usa paginación** para listas grandes (futuro)
- ✅ **Evita peticiones innecesarias**
- ✅ **Optimiza imágenes** de personajes

### 8.4 Seguridad

- ✅ **Nunca envíes contraseñas** en texto plano (ya está encriptado en backend)
- ✅ **Valida permisos** en frontend Y backend
- ✅ **Usa HTTPS** en producción
- ✅ **Sanitiza inputs** del usuario

---

## 9. Ejemplos de Integración

### 9.1 Ejemplo Completo: Flujo de Usuario Nuevo

```javascript
// 1. Registrar usuario
const registerResponse = await axios.post('/api/v1/auth/register', {
  username: 'nuevo_usuario',
  email: 'usuario@example.com',
  password: 'contraseña123',
  nombre: 'Juan',
  apellido: 'Pérez'
});

const token = registerResponse.data.token;
localStorage.setItem('token', token);

// 2. Obtener información del usuario
const userResponse = await axios.get('/api/v1/auth/me', {
  headers: { Authorization: `Bearer ${token}` }
});

console.log('Usuario:', userResponse.data);
console.log('Puntos iniciales:', userResponse.data.puntosDisponibles); // 600

// 3. Ver personajes disponibles
const personajesResponse = await axios.get('/api/v1/personajes/disponibles', {
  headers: { Authorization: `Bearer ${token}` }
});

// 4. Comprar un personaje
const compraResponse = await axios.post('/api/v1/personajes/2/comprar', {}, {
  headers: { Authorization: `Bearer ${token}` }
});

console.log('Personaje comprado:', compraResponse.data);
console.log('Puntos restantes:', compraResponse.data.puntosDisponiblesRestantes);

// 5. Ver inventario
const inventarioResponse = await axios.get('/api/v1/personajes/desbloqueados', {
  headers: { Authorization: `Bearer ${token}` }
});

// 6. Activar personaje
await axios.put('/api/v1/personajes/2/activar', {}, {
  headers: { Authorization: `Bearer ${token}` }
});

// 7. Crear y completar sesión
const sesionResponse = await axios.post('/api/v1/sesiones', {
  fecha: '2024-12-26',
  tipoPomodoro: 'TRABAJO',
  duracionMinutos: 25,
  detalles: [{
    fase: 'TRABAJO',
    duracionMinutos: 25,
    completada: false
  }]
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// Completar sesión (otorga puntos)
await axios.post(`/api/v1/sesiones/${sesionResponse.data.id}/completar`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});

// 8. Ver estadísticas
const estadisticasResponse = await axios.get('/api/v1/estadisticas/mi-progreso', {
  headers: { Authorization: `Bearer ${token}` }
});

console.log('Puntos totales:', estadisticasResponse.data.puntosTotales); // 610
```

### 9.2 Ejemplo: Integración con React

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

```typescript
// services/authService.ts
import api from './api';

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
```

### 9.3 Ejemplo: Integración con Python

```python
import requests

BASE_URL = "http://localhost:8080/api/v1"

# 1. Registrar usuario
register_data = {
    "username": "nuevo_usuario",
    "email": "usuario@example.com",
    "password": "contraseña123",
    "nombre": "Juan",
    "apellido": "Pérez"
}

response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
token = response.json()["token"]

# 2. Headers con token
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# 3. Obtener usuario actual
user_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
user = user_response.json()
print(f"Usuario: {user['username']}, Puntos: {user['puntosDisponibles']}")

# 4. Comprar personaje
compra_response = requests.post(
    f"{BASE_URL}/personajes/2/comprar",
    headers=headers
)
print(compra_response.json())
```

---

## 10. Resumen de Endpoints

### 10.1 Tabla Completa de Endpoints

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| **Autenticación** |
| POST | `/auth/register` | Registrar usuario | Público |
| POST | `/auth/login` | Iniciar sesión | Público |
| GET | `/auth/me` | Obtener usuario actual | Autenticado |
| **Personajes** |
| GET | `/personajes` | Listar personajes disponibles | Público |
| GET | `/personajes/{id}` | Obtener personaje por ID | Público |
| GET | `/personajes/disponibles` | Personajes comprables | Autenticado |
| GET | `/personajes/desbloqueados` | Mi inventario | Autenticado |
| POST | `/personajes/{id}/comprar` | Comprar personaje | Autenticado |
| PUT | `/personajes/{id}/activar` | Activar personaje | Autenticado |
| GET | `/personajes/admin/all` | Todos los personajes | ADMIN/VENDEDOR |
| GET | `/personajes/admin/adopciones` | Historial adopciones | ADMIN/VENDEDOR |
| PUT | `/personajes/{id}` | Actualizar personaje | ADMIN |
| **Sesiones** |
| POST | `/sesiones` | Crear sesión | Autenticado |
| GET | `/sesiones` | Mis sesiones | Autenticado |
| GET | `/sesiones/{id}` | Obtener sesión | Autenticado |
| POST | `/sesiones/{id}/completar` | Completar sesión | Autenticado |
| DELETE | `/sesiones/{id}` | Eliminar sesión | Autenticado |
| **Notas** |
| GET | `/notas` | Mis notas | Autenticado |
| POST | `/notas` | Crear nota | Autenticado |
| PUT | `/notas/{id}` | Actualizar nota | Autenticado |
| DELETE | `/notas/{id}` | Eliminar nota | Autenticado |
| **Estadísticas** |
| GET | `/estadisticas/puntos/historial` | Historial de puntos | Autenticado |
| GET | `/estadisticas/mi-progreso` | Mi progreso | Autenticado |
| GET | `/estadisticas/ranking` | Top 10 usuarios | Autenticado |
| **Usuarios (Admin)** |
| GET | `/usuarios/admin/all` | Listar usuarios | ADMIN |
| GET | `/usuarios/admin/{id}` | Obtener usuario | ADMIN |
| PUT | `/usuarios/admin/{id}/rol` | Actualizar rol | ADMIN |
| PUT | `/usuarios/admin/{id}/activo` | Activar/desactivar | ADMIN |
| DELETE | `/usuarios/admin/{id}` | Eliminar usuario | ADMIN |

**Total**: 26 endpoints

---

## 11. Limitaciones y Consideraciones

### 11.1 Limitaciones Actuales

- **Paginación**: No implementada (futuro)
- **Búsqueda**: No implementada (futuro)
- **Filtros avanzados**: Limitados
- **Rate limiting**: No implementado (futuro)
- **WebSockets**: No implementado (notificaciones en tiempo real)

### 11.2 Consideraciones de Performance

- Las listas grandes pueden ser lentas (considerar paginación)
- Las imágenes de personajes se cargan desde el frontend
- El ranking se calcula en cada petición (considerar cache)

### 11.3 Consideraciones de Seguridad

- Tokens JWT expiran en 24 horas
- Contraseñas se encriptan con BCrypt
- Validación de permisos en backend (nunca confiar solo en frontend)
- CORS configurado para desarrollo (ajustar en producción)

---

## 12. Soporte y Contacto

### 12.1 Documentación Adicional

- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **README Backend**: Ver `ClarityTimer-backend/README.md`
- **README Frontend**: Ver `ClarityTimer-frontend/README.md`

### 12.2 Reportar Problemas

Si encuentras problemas con la API:

1. Verifica que el backend esté corriendo
2. Revisa los logs del backend
3. Verifica que el token JWT sea válido
4. Consulta Swagger para ver la documentación actualizada
5. Contacta al equipo de desarrollo

---

**Documento generado el**: Diciembre 2024  
**Última actualización**: Diciembre 2024  
**Versión**: 1.0

---

*Este documento debe actualizarse cuando se agreguen nuevos endpoints o se modifiquen los existentes.*

