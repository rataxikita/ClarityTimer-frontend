# Especificación de Requisitos de Software (ERS)
## ClarityTimer - Sistema de Temporizador Pomodoro con Gamificación

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Autores:** Catalina Rosales, Edgar Morales  
**Estándar:** IEEE 830-1998

---

## 1. Introducción

### 1.1 Propósito del Documento

Este documento especifica los requisitos funcionales y no funcionales del sistema ClarityTimer, una aplicación web de temporizador Pomodoro con sistema de gamificación basado en personajes Sanrio. El documento está dirigido a desarrolladores, evaluadores académicos y partes interesadas del proyecto.

### 1.2 Alcance del Proyecto

ClarityTimer es una aplicación web fullstack que permite a los usuarios:
- Gestionar sesiones de estudio mediante la técnica Pomodoro
- Ganar puntos y coleccionar personajes Sanrio como recompensa
- Gestionar notas y estadísticas de productividad
- Administrar usuarios y productos (roles ADMIN y VENDEDOR)

**Fuera del alcance:**
- Aplicaciones móviles nativas
- Integración con servicios externos de productividad
- Sistema de pagos reales

### 1.3 Definiciones, Acrónimos y Abreviaciones

- **Pomodoro:** Técnica de gestión del tiempo que divide el trabajo en intervalos de 25 minutos
- **JWT:** JSON Web Token, estándar de autenticación
- **REST:** Representational State Transfer, estilo arquitectónico para servicios web
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **RBAC:** Role-Based Access Control

### 1.4 Referencias

- IEEE 830-1998: Recommended Practice for Software Requirements Specifications
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- MySQL Documentation: https://dev.mysql.com/doc/

### 1.5 Resumen del Documento

Este documento está organizado en secciones que describen la funcionalidad del sistema, sus requisitos funcionales y no funcionales, casos de uso, modelo de datos y restricciones.

---

## 2. Descripción General

### 2.1 Perspectiva del Producto

ClarityTimer es una aplicación web independiente que consta de:
- **Frontend:** Aplicación React ejecutándose en el navegador del usuario
- **Backend:** Servidor Spring Boot que procesa las peticiones
- **Base de Datos:** MySQL para persistencia de datos

El sistema se comunica mediante una API REST y utiliza JWT para autenticación.

### 2.2 Funciones del Producto

Las funciones principales del sistema son:

1. **Gestión de Usuarios:** Registro, autenticación y administración de cuentas
2. **Temporizador Pomodoro:** Configuración y ejecución de sesiones de estudio/descanso
3. **Sistema de Gamificación:** Puntos, personajes coleccionables y certificados
4. **Gestión de Notas:** Creación, edición y organización de notas
5. **Estadísticas:** Seguimiento de progreso y ranking de usuarios
6. **Administración:** Gestión de productos y usuarios (roles ADMIN/VENDEDOR)

### 2.3 Características de los Usuarios

El sistema contempla tres tipos de usuarios:

- **CLIENTE:** Usuario final que utiliza el temporizador, compra personajes y gestiona notas
- **VENDEDOR:** Usuario con acceso a inventario de tienda y registro de adopciones
- **ADMIN:** Usuario con control total del sistema, gestión de productos y usuarios

### 2.4 Restricciones

**Técnicas:**
- Requiere Java 17+ para el backend
- Requiere MySQL 8.0+ para la base de datos
- Requiere navegador moderno con soporte para JavaScript ES6+

**De Negocio:**
- No se puede eliminar el último administrador activo
- Solo se otorgan puntos por pomodoros de trabajo completados
- Usuarios inactivos no pueden iniciar sesión

**Legales:**
- Uso de personajes Sanrio con fines educativos/académicos

---

## 3. Requisitos Funcionales Específicos

### 3.1 Autenticación y Autorización

**RF-001: Registro de Usuarios**
- El sistema debe permitir el registro de nuevos usuarios
- Debe validar que el username y email sean únicos
- Debe validar que la contraseña tenga mínimo 6 caracteres
- Al registrarse, el usuario debe recibir 600 puntos de bienvenida
- Al registrarse, el usuario debe recibir el personaje Cinnamoroll gratis y activo
- Prioridad: Alta

**RF-002: Inicio de Sesión**
- El sistema debe permitir el inicio de sesión con username y contraseña
- Debe generar un token JWT válido por 30 días
- Debe rechazar el inicio de sesión de usuarios inactivos con mensaje: "Usuario deshabilitado. Comunícate con el administrador."
- Prioridad: Alta

**RF-003: Gestión de Sesiones**
- El sistema debe mantener la sesión del usuario mediante JWT
- Debe invalidar tokens expirados
- Debe redirigir al login cuando el token expire
- Prioridad: Media

**RF-004: Control de Acceso por Roles**
- El sistema debe restringir el acceso a rutas según el rol del usuario
- CLIENTE: Acceso a aplicación principal
- VENDEDOR: Acceso a `/vendedor` y aplicación principal
- ADMIN: Acceso a todas las rutas incluyendo `/admin` y aplicación principal
- Prioridad: Alta

**RF-005: Gestión de Usuarios (ADMIN)**
- El sistema debe permitir a ADMIN listar todos los usuarios
- Debe permitir editar el rol de usuarios
- Debe permitir activar/desactivar usuarios
- Debe permitir eliminar usuarios (excepto el último ADMIN activo)
- Prioridad: Media

### 3.2 Temporizador Pomodoro

**RF-006: Configuración de Tiempos**
- El sistema debe permitir configurar tiempo de estudio (1-120 minutos, default: 25)
- Debe permitir configurar tiempo de descanso (1-60 minutos, default: 5)
- Debe permitir configurar número de sesiones (1-20, default: 4)
- Debe permitir activar/desactivar modo automático
- Prioridad: Alta

**RF-007: Ejecución del Temporizador**
- El sistema debe iniciar la cuenta regresiva al presionar "Iniciar"
- Debe permitir pausar y reanudar sin perder el tiempo transcurrido
- Debe permitir reiniciar la sesión actual
- Debe mostrar el personaje activo durante las sesiones
- Prioridad: Alta

**RF-008: Transición entre Fases**
- El sistema debe alternar automáticamente entre trabajo y descanso
- Debe otorgar descansos largos (3x tiempo normal) cada 4 sesiones
- Debe reproducir notificación de sonido al completar cada fase
- Debe respetar el modo automático si está activado
- Prioridad: Alta

**RF-009: Creación de Sesiones**
- El sistema debe crear una sesión en el backend al iniciar el temporizador
- Debe guardar todos los detalles de cada pomodoro (trabajo y descanso)
- Debe registrar horas de inicio y fin de cada fase
- Prioridad: Alta

**RF-010: Completar Sesión**
- El sistema debe completar la sesión cuando se terminan todos los pomodoros configurados
- Debe otorgar 10 puntos por cada pomodoro de TRABAJO completado
- Debe calcular y otorgar bonus por racha (si aplica)
- Debe actualizar el historial de puntos
- Prioridad: Alta

### 3.3 Sistema de Gamificación

**RF-011: Sistema de Puntos**
- El sistema debe otorgar 10 puntos por cada pomodoro de trabajo completado
- Debe otorgar bonus por racha: +10 a 3 días, +20 a 7 días, +50 a 30 días
- Debe otorgar 600 puntos de bienvenida al registrarse
- Debe mantener puntos totales y puntos disponibles por separado
- Prioridad: Alta

**RF-012: Tienda de Personajes**
- El sistema debe mostrar todos los personajes disponibles para compra
- Debe mostrar el precio en puntos de cada personaje
- Debe permitir comprar personajes si el usuario tiene puntos suficientes
- Debe descontar los puntos al realizar la compra
- Debe generar un certificado único para cada personaje comprado
- Prioridad: Alta

**RF-013: Inventario de Personajes**
- El sistema debe mostrar todos los personajes desbloqueados por el usuario
- Debe permitir activar un personaje (solo uno activo a la vez)
- Debe mostrar el certificado de adopción de cada personaje
- Debe registrar cuántas veces se ha usado cada personaje
- Prioridad: Alta

**RF-014: Personajes Disponibles**
- El sistema debe incluir 10 personajes Sanrio con diferentes rarezas
- Debe asignar Cinnamoroll gratis al registrarse
- Debe categorizar personajes: Común, Raro, Épico, Legendario
- Prioridad: Media

**RF-015: Certificados de Adopción**
- El sistema debe generar un código único para cada personaje comprado (formato: CERT-XXXXX)
- Debe permitir visualizar e imprimir certificados
- Debe incluir información del personaje y fecha de adopción
- Prioridad: Baja

### 3.4 Sistema de Notas

**RF-016: Crear Notas**
- El sistema debe permitir crear notas con título y contenido
- Debe asignar una categoría (General, Estudio, Descanso, Ideas, Tareas)
- Debe guardar la fecha de creación
- Prioridad: Media

**RF-017: Gestionar Notas**
- El sistema debe permitir editar y eliminar notas
- Debe permitir marcar notas como completadas
- Debe permitir fijar notas importantes
- Debe sincronizar con el backend automáticamente
- Prioridad: Media

### 3.5 Estadísticas y Progreso

**RF-018: Historial de Puntos**
- El sistema debe mostrar el historial completo de transacciones de puntos
- Debe incluir tipo de transacción (GANADO, GASTADO, REGALO)
- Debe mostrar fecha y descripción de cada transacción
- Prioridad: Media

**RF-019: Progreso del Usuario**
- El sistema debe mostrar puntos totales y disponibles
- Debe mostrar la racha actual de días
- Debe mostrar el progreso diario de sesiones completadas
- Prioridad: Media

**RF-020: Ranking**
- El sistema debe mostrar el Top 10 de usuarios por puntos totales
- Debe actualizarse automáticamente
- Prioridad: Baja

### 3.6 Panel de Administración

**RF-021: Gestión de Productos (ADMIN)**
- El sistema debe permitir ver todos los personajes (disponibles y no disponibles)
- Debe permitir editar el precio de personajes
- Debe permitir activar/desactivar la disponibilidad de personajes
- Prioridad: Media

**RF-022: Gestión de Usuarios (ADMIN)**
- El sistema debe permitir listar todos los usuarios con sus datos
- Debe permitir editar el rol de usuarios
- Debe permitir activar/desactivar usuarios
- Debe permitir eliminar usuarios (con validación: no eliminar último ADMIN)
- Prioridad: Media

**RF-023: Historial de Adopciones (ADMIN/VENDEDOR)**
- El sistema debe mostrar el historial completo de compras de personajes
- Debe incluir información del usuario y personaje comprado
- Debe incluir fecha y puntos gastados
- Prioridad: Baja

### 3.7 Panel de Vendedor

**RF-024: Inventario de Tienda (VENDEDOR)**
- El sistema debe mostrar todos los personajes disponibles en la tienda
- Debe mostrar información de precios y disponibilidad
- Prioridad: Baja

**RF-025: Registro de Adopciones (VENDEDOR)**
- El sistema debe mostrar el historial de adopciones de todos los usuarios
- Debe permitir consultar información de adopciones
- Prioridad: Baja

---

## 4. Requisitos No Funcionales

### 4.1 Rendimiento

**RNF-001:** El sistema debe responder a peticiones HTTP en menos de 2 segundos en condiciones normales.

**RNF-002:** El frontend debe cargar completamente en menos de 3 segundos.

**RNF-003:** El sistema debe soportar al menos 50 usuarios concurrentes.

### 4.2 Seguridad

**RNF-004:** Las contraseñas deben encriptarse usando BCrypt antes de almacenarse.

**RNF-005:** La autenticación debe realizarse mediante JWT con expiración de 30 días.

**RNF-006:** Las rutas deben estar protegidas según roles mediante Spring Security.

**RNF-007:** Los usuarios inactivos no deben poder iniciar sesión.

**RNF-008:** CORS debe estar configurado para permitir solo orígenes autorizados.

### 4.3 Usabilidad

**RNF-009:** La interfaz debe ser intuitiva y no requerir capacitación previa.

**RNF-010:** Los mensajes de error deben ser claros y específicos.

**RNF-011:** El sistema debe proporcionar retroalimentación visual inmediata a las acciones del usuario.

### 4.4 Compatibilidad

**RNF-012:** El backend debe ejecutarse en Java 17 o superior.

**RNF-013:** La base de datos debe ser MySQL 8.0 o superior.

**RNF-014:** El frontend debe ser compatible con navegadores modernos (Chrome, Firefox, Edge, Safari).

### 4.5 Mantenibilidad

**RNF-015:** El código debe seguir convenciones de nomenclatura estándar.

**RNF-016:** El código debe incluir comentarios en secciones complejas.

**RNF-017:** La API debe estar documentada mediante Swagger/OpenAPI.

### 4.6 Disponibilidad

**RNF-018:** El sistema debe estar disponible durante el horario de uso académico.

**RNF-019:** Los datos deben persistirse en base de datos para evitar pérdida de información.

---

## 5. Casos de Uso

### CU-001: Registrar Usuario

**Actor:** Usuario no registrado

**Precondiciones:** Ninguna

**Flujo Principal:**
1. El usuario accede a la página de registro
2. Completa el formulario (username, email, contraseña, nombre, apellido)
3. El sistema valida que el username y email sean únicos
4. El sistema crea la cuenta y otorga 600 puntos + Cinnamoroll gratis
5. El sistema inicia sesión automáticamente
6. El usuario es redirigido a la aplicación principal

**Flujos Alternativos:**
- 3a. Si el username o email ya existe, muestra error y vuelve al paso 2
- 3b. Si la contraseña tiene menos de 6 caracteres, muestra error y vuelve al paso 2

**Postcondiciones:** Usuario registrado, autenticado y con puntos iniciales

---

### CU-002: Iniciar Sesión

**Actor:** Usuario registrado

**Precondiciones:** Usuario debe estar registrado

**Flujo Principal:**
1. El usuario accede a la página de login
2. Ingresa username y contraseña
3. El sistema valida las credenciales
4. El sistema verifica que el usuario esté activo
5. El sistema genera token JWT
6. El usuario es redirigido a la aplicación principal

**Flujos Alternativos:**
- 3a. Si las credenciales son incorrectas, muestra "Credenciales inválidas"
- 4a. Si el usuario está inactivo, muestra "Usuario deshabilitado. Comunícate con el administrador."

**Postcondiciones:** Usuario autenticado con token JWT válido

---

### CU-003: Usar Temporizador Pomodoro

**Actor:** Usuario autenticado (CLIENTE o ADMIN)

**Precondiciones:** Usuario debe estar autenticado y tener personaje activo

**Flujo Principal:**
1. El usuario configura tiempos (opcional, puede usar valores por defecto)
2. El usuario presiona "Iniciar"
3. El sistema inicia la cuenta regresiva
4. El sistema muestra el personaje activo
5. Al completar el tiempo, el sistema reproduce sonido y transiciona a la siguiente fase
6. Si se completan todos los pomodoros, el sistema otorga puntos

**Flujos Alternativos:**
- 3a. El usuario puede pausar en cualquier momento
- 3b. El usuario puede reiniciar la sesión actual

**Postcondiciones:** Sesión completada, puntos otorgados (si aplica)

---

### CU-004: Comprar Personaje

**Actor:** Usuario autenticado (CLIENTE o ADMIN)

**Precondiciones:** Usuario debe tener puntos suficientes

**Flujo Principal:**
1. El usuario accede a la tienda
2. Selecciona un personaje disponible
3. Verifica que tiene puntos suficientes
4. Presiona "Comprar"
5. El sistema valida puntos y descuenta el precio
6. El sistema agrega el personaje al inventario
7. El sistema genera certificado único
8. El sistema muestra confirmación

**Flujos Alternativos:**
- 3a. Si no tiene puntos suficientes, muestra error y deshabilita botón de compra

**Postcondiciones:** Personaje agregado al inventario, puntos descontados

---

### CU-005: Gestionar Usuarios (ADMIN)

**Actor:** Usuario con rol ADMIN

**Precondiciones:** Usuario debe estar autenticado como ADMIN

**Flujo Principal:**
1. El ADMIN accede a la pestaña "Usuarios"
2. El sistema muestra lista de todos los usuarios
3. El ADMIN puede:
   - Editar rol de usuario
   - Activar/desactivar usuario
   - Eliminar usuario (con validación)
4. El sistema actualiza los cambios

**Flujos Alternativos:**
- 3a. Si intenta eliminar el último ADMIN activo, muestra error

**Postcondiciones:** Cambios aplicados en la base de datos

---

## 6. Modelo de Datos

### 6.1 Entidades Principales

**Usuario:**
- Almacena información de autenticación y perfil
- Relacionado con: SesionPomodoro, InventarioUsuario, Nota, HistorialPuntos, ConfiguracionUsuario

**PersonajeSanrio:**
- Almacena información de personajes disponibles
- Relacionado con: InventarioUsuario, CategoriaPersonaje

**SesionPomodoro:**
- Almacena información de sesiones completadas
- Relacionado con: Usuario, DetalleSesion, PersonajeSanrio

**DetalleSesion:**
- Almacena información de cada pomodoro individual
- Relacionado con: SesionPomodoro

**InventarioUsuario:**
- Almacena relación usuario-personaje comprado
- Relacionado con: Usuario, PersonajeSanrio

**Nota:**
- Almacena notas del usuario
- Relacionado con: Usuario

**HistorialPuntos:**
- Almacena transacciones de puntos
- Relacionado con: Usuario, SesionPomodoro (opcional)

### 6.2 Relaciones

- Usuario 1:N SesionPomodoro
- Usuario 1:N InventarioUsuario
- Usuario 1:N Nota
- Usuario 1:N HistorialPuntos
- Usuario 1:1 ConfiguracionUsuario
- PersonajeSanrio 1:N InventarioUsuario
- PersonajeSanrio N:1 CategoriaPersonaje
- SesionPomodoro 1:N DetalleSesion
- SesionPomodoro N:1 PersonajeSanrio

---

## 7. Interfaz de Usuario

### 7.1 Páginas Principales

**Login/Registro:**
- Formularios simples con validación
- Mensajes de error claros

**Aplicación Principal:**
- Sistema de pestañas para navegación
- Temporizador, Tienda, Inventario, Estadísticas, Notas, Configuración
- Pestañas adicionales para ADMIN: Productos, Usuarios

**Panel Vendedor:**
- Vista dedicada con inventario y adopciones

### 7.2 Flujos de Navegación

- Usuario no autenticado → Login/Registro
- CLIENTE autenticado → Aplicación principal
- VENDEDOR autenticado → Aplicación principal + Panel Vendedor
- ADMIN autenticado → Aplicación principal + Paneles de administración

---

## 8. Restricciones

### 8.1 Técnicas

- Backend requiere Java 17+
- Base de datos requiere MySQL 8.0+
- Frontend requiere navegador moderno

### 8.2 De Negocio

- No se puede eliminar el último ADMIN activo
- Solo se otorgan puntos por pomodoros de TRABAJO
- Usuarios inactivos no pueden iniciar sesión
- Solo un personaje activo por usuario a la vez

### 8.3 De Seguridad

- Tokens JWT expiran en 30 días
- Contraseñas deben tener mínimo 6 caracteres
- CORS restringido a orígenes autorizados

---

## 9. Glosario

- **Pomodoro:** Intervalo de tiempo de trabajo (típicamente 25 minutos)
- **Streak:** Racha de días consecutivos completando sesiones
- **Personaje Activo:** Personaje seleccionado que aparece durante las sesiones
- **Certificado de Adopción:** Documento único que certifica la compra de un personaje
- **Rareza:** Clasificación de personajes (Común, Raro, Épico, Legendario)
- **JWT:** Token de autenticación estándar
- **RBAC:** Control de acceso basado en roles

---

**Fin del Documento**

