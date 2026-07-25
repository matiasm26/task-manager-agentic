# Task Manager Agentic

Aplicación web monolítica MVC con renderizado del servidor para gestión de tareas personales.

Incluye registro de usuarios, inicio de sesión, cierre de sesión, sesiones con cookie, rutas protegidas y CRUD de tareas. Cada usuario ve y modifica únicamente sus propias tareas. Las tareas tienen título, descripción opcional, fecha límite opcional, estado y prioridad.

Stack utilizado: Node.js, TypeScript, Express, Handlebars, Prisma, SQLite, `express-session`, `bcryptjs` y Zod.

## Objetivo del software

El objetivo del software es resolver la organización básica de tareas personales en una aplicación web simple, segura y mantenible. Está dirigido a usuarios que necesitan registrar una cuenta, autenticarse y gestionar sus propias tareas desde un dashboard privado.

La aplicación permite:

- Registrar usuarios.
- Iniciar y cerrar sesión.
- Mantener sesión mediante cookie.
- Crear, listar, editar y eliminar tareas.
- Definir estado y prioridad de cada tarea.
- Aislar las tareas por usuario autenticado, evitando que un usuario vea o modifique tareas ajenas.

## Requisitos

- Node.js >=22.22.2.
- npm instalado.

## Instalación

Instala las dependencias del proyecto:

```bash
npm install
```

## Variables de entorno

Copia el archivo de ejemplo para crear tu configuración local:

```bash
cp .env.example .env
```

En Windows PowerShell puedes usar:

```powershell
Copy-Item .env.example .env
```

El archivo `.env` debe contener al menos:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
SESSION_SECRET="cambia-este-secreto-en-desarrollo"
```

`DATABASE_URL` es requerida por Prisma para conectarse a SQLite. `SESSION_SECRET` firma la cookie de sesión y debe ser un valor privado en cada entorno. El archivo `.env` es local y no se versiona en Git.

## Base de datos

Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev
```

Genera Prisma Client:

```bash
npm run prisma:generate
```

## Desarrollo

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

Por defecto la aplicación queda disponible en:

```text
http://localhost:3000
```

Rutas principales:

```text
/                  Página de bienvenida
/auth/register     Registro
/auth/login        Inicio de sesión
/dashboard         Dashboard protegido y tareas del usuario autenticado
/tasks/:id/edit    Edición de tarea propia
```

## Producción local

Compila TypeScript:

```bash
npm run build
```

Inicia la versión compilada:

```bash
npm start
```

## Estructura de carpetas

```text
.
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── prisma/
    ├── routes/
    ├── schemas/
    ├── services/
    ├── types/
    └── views/
```

Función de cada carpeta principal:

- `prisma/`: contiene `schema.prisma` y las migraciones de base de datos.
- `src/controllers/`: recibe solicitudes, valida entradas y coordina respuestas HTTP o vistas.
- `src/services/`: concentra reglas de acceso a datos, uso de Prisma y operaciones de autenticación.
- `src/schemas/`: define validaciones Zod para formularios de registro, login y tareas.
- `src/routes/`: declara rutas Express y aplica middlewares de protección.
- `src/middlewares/`: contiene manejo de autenticación y errores.
- `src/views/`: contiene vistas Handlebars para home, auth, dashboard, tareas y errores.
- `src/config/`: contiene configuración de sesión.
- `src/types/`: contiene extensiones de tipos de TypeScript, como `express-session`.
- `src/prisma/`: contiene el cliente Prisma centralizado usado por los servicios.

## Justificación de tecnologías

- **Node.js**: permite ejecutar JavaScript/TypeScript en el servidor con un ecosistema amplio para aplicaciones web.
- **TypeScript**: agrega tipado estático para reducir errores y mejorar mantenibilidad.
- **Express**: entrega una base simple para rutas, middlewares y renderizado del servidor sin sobreingeniería.
- **Handlebars**: permite crear vistas HTML del lado del servidor con plantillas simples.
- **Prisma**: facilita modelar la base de datos, ejecutar migraciones y consultar SQLite con tipos generados.
- **SQLite**: base de datos local suficiente para un proyecto académico monolítico y fácil de ejecutar.
- **Zod**: centraliza la validación de entradas antes de llegar a Prisma.
- **express-session**: mantiene sesiones de usuario mediante cookies firmadas.
- **bcryptjs**: permite guardar contraseñas como hash y verificar credenciales sin almacenar texto plano.

## Proveedor y modelos de IA

Durante el desarrollo se utilizó el arnés de trabajo **Oh My Pi** con proveedor **OpenAI**.

Modelo identificado en el entorno disponible:

- `openai-codex/gpt-5.5`: usado como asistente principal para análisis, planificación, implementación, auditoría, verificación y redacción de documentación.

También se usaron subagentes de tipo `scout` para auditorías de solo lectura sobre MVC, vistas, Prisma y configuración. El historial disponible identifica el tipo de subagente, pero no expone el nombre interno exacto del modelo usado por esos subagentes; por lo tanto, no se inventa un modelo adicional.

## Patrón de arquitectura MVC

El proyecto aplica MVC de forma simple:

- **Modelo**: `prisma/schema.prisma` define `User`, `Task`, relaciones, defaults y enums. `src/services/` usa Prisma para acceder a esos modelos.
- **Vista**: `src/views/` contiene plantillas Handlebars renderizadas por el servidor, incluyendo login, registro, dashboard, edición de tareas y errores.
- **Controlador**: `src/controllers/` recibe solicitudes Express, valida datos, llama servicios y renderiza vistas o redirecciones.

Capas complementarias:

- `src/services/`: separa lógica de acceso a datos y autenticación para evitar Prisma directo en rutas o vistas.
- `src/schemas/`: define validación Zod para mantener reglas de entrada centralizadas.
- `src/middlewares/`: protege rutas con sesión y maneja errores HTTP.
- `src/routes/`: conecta URLs y métodos HTTP con controladores y middlewares.

## Constitución del arnés agéntico

El archivo `AGENTS.md` funciona como constitución del arnés agéntico del proyecto. Define el objetivo académico, stack permitido, arquitectura MVC, estructura esperada, reglas de seguridad, validación, vistas, pruebas y definición de terminado.

Principios aplicados durante el desarrollo:

- Respetar el stack definido: Node.js, TypeScript, Express, Handlebars, Prisma, SQLite, `express-session`, `bcryptjs` y Zod.
- Mantener arquitectura MVC y evitar sobreingeniería.
- Planificar antes de modificar código.
- Presentar planes para revisión humana cuando el cambio lo requería.
- Implementar cambios pequeños por funcionalidad: estructura inicial, modelos, registro, sesiones, tareas, auditoría y diseño.
- Validar después de cada etapa con `npm run build`, comandos Prisma, pruebas funcionales y revisión de Git.
- Mantener un flujo humano-agente: solicitud, análisis, plan, aprobación, implementación, verificación, auditoría, staging y commit.

## Notas de seguridad

- No subas `.env` al repositorio.
- Usa `.env.example` solo como plantilla.
- No guardes contraseñas en texto plano.
- Las rutas de tareas deben operar con el usuario autenticado en sesión.
- Las tareas ajenas no deben revelarse ni modificarse.
