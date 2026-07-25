# Task Manager Agentic

Aplicación monolítica MVC con renderizado del servidor para gestión de tareas personales.

Incluye registro de usuarios, inicio de sesión, cierre de sesión, sesiones con cookie, rutas protegidas y CRUD de tareas. Cada usuario ve y modifica únicamente sus propias tareas. Las tareas tienen título, descripción opcional, fecha límite opcional, estado y prioridad.

Stack utilizado: Node.js, TypeScript, Express, Handlebars, Prisma, SQLite, `express-session`, `bcryptjs` y Zod.

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

## Notas de seguridad

- No subas `.env` al repositorio.
- Usa `.env.example` solo como plantilla.
- No guardes contraseñas en texto plano.
- Las rutas de tareas deben operar con el usuario autenticado en sesión.
- Las tareas ajenas no deben revelarse ni modificarse.
