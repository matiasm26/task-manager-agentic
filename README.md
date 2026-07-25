# Task Manager Agentic

Aplicación monolítica MVC con renderizado del servidor para gestión de tareas. Stack base: Node.js, TypeScript, Express, Handlebars, Prisma y SQLite.

## Requisitos

- Node.js instalado.
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
```

`DATABASE_URL` es requerida por Prisma para conectarse a SQLite. El archivo `.env` es local y no se versiona en Git.

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
