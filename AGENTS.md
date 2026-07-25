# AGENTS.md

## 1. Objetivo del proyecto

Este proyecto es una aplicación web monolítica con renderizado del servidor para la gestión de tareas personales. Debe cumplir con una evaluación académica sobre construcción de software usando un arnés agéntico: el agente debe trabajar con reglas explícitas, mantener una arquitectura MVC simple y entregar una aplicación funcional, verificable y mantenible.

El objetivo técnico es implementar una solución mínima y completa con Node.js, TypeScript, Express, Handlebars, Prisma, SQLite, `express-session`, `bcryptjs` y Zod, sin introducir frameworks, servicios externos ni patrones innecesarios.

## 2. Alcance funcional

La aplicación debe incluir únicamente estas capacidades funcionales:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Manejo de sesión persistente mediante cookie de sesión.
- Rutas protegidas para usuarios autenticados.
- CRUD completo de tareas:
  - Crear tarea.
  - Listar tareas del usuario autenticado.
  - Ver detalle de una tarea propia cuando exista una vista dedicada.
  - Editar tarea propia.
  - Eliminar tarea propia.
- Separación de tareas por usuario: un usuario nunca debe ver, editar ni eliminar tareas de otro usuario.
- Renderizado HTML desde el servidor con Handlebars.

Fuera de alcance salvo instrucción explícita del usuario:

- API REST pública separada del flujo HTML.
- SPA o frontend con framework JavaScript.
- Roles avanzados o permisos granulares.
- Recuperación de contraseña por correo.
- OAuth, JWT o autenticación externa.
- Colas, workers, cache, websockets o microservicios.
- Internacionalización completa.

## 3. Stack tecnológico aprobado

El stack aprobado para este proyecto es cerrado:

- Runtime: Node.js.
- Lenguaje: TypeScript.
- Servidor HTTP: Express.
- Vistas: Handlebars.
- ORM: Prisma.
- Base de datos: SQLite.
- Sesiones: `express-session`.
- Hash de contraseñas: `bcryptjs`.
- Validación: Zod.

Reglas:

- No instalar dependencias nuevas sin necesidad explícita y justificada.
- No cambiar SQLite por otra base de datos.
- No reemplazar Handlebars por React, Vue, Angular, Svelte u otro framework.
- No reemplazar sesiones por JWT.
- No introducir librerías de arquitectura, inyección de dependencias, event bus, CQRS, repositorios genéricos ni capas abstractas si Express, Prisma y funciones simples bastan.

## 4. Arquitectura MVC y responsabilidades de cada capa

La aplicación debe seguir MVC de forma directa.

### Modelo

Responsabilidades:

- Definir entidades persistentes en `prisma/schema.prisma`.
- Representar `User` y `Task` con relaciones claras.
- Centralizar el acceso a datos mediante Prisma.
- Garantizar consultas filtradas por usuario cuando la entidad pertenezca a un usuario.

No debe contener:

- Lógica de renderizado HTML.
- Lectura directa de `req` o `res`.
- Decisiones de navegación.

### Vista

Responsabilidades:

- Renderizar HTML con Handlebars.
- Mostrar formularios, mensajes de error, estados vacíos y datos recibidos desde controladores.
- Usar layouts y parciales simples cuando reduzcan duplicación real.

No debe contener:

- Consultas a base de datos.
- Hash de contraseñas.
- Reglas de negocio críticas.
- Lógica compleja que deba estar en controladores o validadores.

### Controlador

Responsabilidades:

- Recibir solicitudes Express.
- Ejecutar validaciones Zod.
- Coordinar Prisma, sesiones y vistas.
- Decidir redirecciones y códigos HTTP.
- Pasar datos mínimos y seguros a las vistas.

No debe contener:

- HTML armado como strings.
- SQL manual cuando Prisma resuelve la operación.
- Reglas duplicadas que ya existan en validadores o middleware.

### Middleware

Responsabilidades:

- Proteger rutas privadas.
- Exponer datos mínimos del usuario autenticado a `res.locals` cuando sea necesario.
- Centralizar manejo de 404 y errores inesperados.

## 5. Estructura de carpetas esperada

La estructura esperada debe mantenerse simple:

```text
.
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── session.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── task.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── task.routes.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   └── task.schema.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── task.service.ts
│   ├── prisma/
│   │   └── client.ts
│   ├── types/
│   │   └── express-session.d.ts
│   └── views/
│       ├── layouts/
│       │   └── main.hbs
│       ├── partials/
│       ├── auth/
│       │   ├── login.hbs
│       │   └── register.hbs
│       ├── tasks/
│       │   ├── index.hbs
│       │   ├── new.hbs
│       │   ├── show.hbs
│       │   └── edit.hbs
│       ├── home.hbs
│       ├── error.hbs
│       └── not-found.hbs
├── package.json
├── tsconfig.json
└── AGENTS.md
```

Reglas:

- Esta estructura es guía preferida, no permiso para crear archivos vacíos.
- Crear solo archivos necesarios para la funcionalidad solicitada.
- Si el proyecto existente ya usa nombres equivalentes, respetar la convención existente antes de renombrar.
- No mover archivos sin actualizar imports, rutas y verificación.

## 6. Convenciones de nombres y estilo

Reglas generales:

- Usar TypeScript estricto cuando el proyecto lo permita.
- Usar nombres en inglés para código, archivos, variables, funciones, modelos y rutas internas.
- Usar español en textos visibles al usuario si la aplicación ya está en español.
- Usar `camelCase` para variables y funciones.
- Usar `PascalCase` para tipos, interfaces y modelos Prisma.
- Usar nombres de archivo descriptivos con sufijo de responsabilidad:
  - `*.controller.ts`
  - `*.routes.ts`
  - `*.middleware.ts`
  - `*.schema.ts`
  - `*.service.ts`
- Evitar abreviaturas opacas.
- Evitar comentarios que repitan el código; comentar solo decisiones no evidentes.
- Preferir funciones pequeñas con una responsabilidad clara.
- No mezclar estilos de importación si el proyecto ya tiene una convención.

Reglas de rutas:

- Rutas públicas de auth:
  - `GET /register`
  - `POST /register`
  - `GET /login`
  - `POST /login`
  - `POST /logout`
- Rutas protegidas de tareas:
  - `GET /tasks`
  - `GET /tasks/new`
  - `POST /tasks`
  - `GET /tasks/:id`
  - `GET /tasks/:id/edit`
  - `POST /tasks/:id`
  - `POST /tasks/:id/delete`

Usar métodos `POST` para mutaciones desde formularios HTML. No depender de JavaScript del navegador para completar operaciones básicas.

## 7. Reglas de autenticación, sesiones y seguridad

Autenticación:

- La contraseña nunca se guarda en texto plano.
- Registrar usuarios con hash usando `bcryptjs`.
- Comparar contraseñas con `bcryptjs.compare`.
- No devolver ni renderizar `passwordHash`.
- Impedir registro con email duplicado mediante restricción única y manejo de error claro.

Sesiones:

- Usar `express-session`.
- Guardar en sesión solo datos mínimos, preferentemente `userId`.
- No guardar el objeto completo del usuario en sesión.
- Regenerar sesión después de login exitoso cuando sea práctico con la configuración existente.
- Destruir sesión en logout y redirigir a login o home pública.
- Configurar cookie `httpOnly: true`.
- Usar `secure: true` solo cuando la aplicación corra detrás de HTTPS.
- Definir `sameSite` al menos como `lax`.
- El secreto de sesión debe venir de variable de entorno cuando exista infraestructura para ello; para entorno académico local puede existir valor por defecto solo si no expone credenciales reales.

Rutas protegidas:

- Toda ruta de tareas debe exigir usuario autenticado.
- Si no hay sesión válida, redirigir a `/login` o responder 401 según el patrón existente.
- Nunca confiar en `userId` enviado desde formularios.
- Toda consulta de tareas debe filtrar por `session.userId`.

Seguridad básica:

- Validar toda entrada del usuario con Zod antes de usarla.
- Escapar salida mediante Handlebars; no usar triple-stash `{{{ }}}` salvo contenido controlado y justificado.
- No exponer stack traces al usuario final.
- No registrar contraseñas, hashes ni cookies de sesión.
- Evitar mensajes de login que permitan enumerar usuarios; usar mensaje general como `Credenciales inválidas`.

## 8. Reglas para el modelo User

El modelo `User` debe representar una cuenta local de la aplicación.

Campos mínimos esperados:

- `id`: identificador único.
- `name`: nombre visible o de referencia.
- `email`: correo único para login.
- `passwordHash`: hash de contraseña.
- `createdAt`: fecha de creación.
- `updatedAt`: fecha de última actualización cuando Prisma lo soporte.
- Relación `tasks`: tareas pertenecientes al usuario.

Reglas:

- `email` debe ser único.
- Normalizar email antes de guardar, usando `trim().toLowerCase()`.
- No permitir contraseña vacía.
- No permitir nombre vacío.
- No seleccionar `passwordHash` salvo en operaciones de autenticación.
- No renderizar `passwordHash` ni enviarlo a vistas.
- Al eliminar usuarios, definir comportamiento de tareas de forma explícita en Prisma o en la lógica de aplicación. Para este proyecto académico, no implementar administración de usuarios salvo que se solicite.

## 9. Reglas para el modelo Task

El modelo `Task` debe representar una tarea creada por un usuario autenticado.

Campos mínimos esperados:

- `id`: identificador único.
- `title`: título obligatorio.
- `description`: descripción opcional.
- `completed`: estado booleano.
- `createdAt`: fecha de creación.
- `updatedAt`: fecha de última actualización cuando Prisma lo soporte.
- `userId`: dueño de la tarea.
- Relación `user`: usuario propietario.

Reglas:

- Toda tarea debe pertenecer a un usuario.
- `title` no puede estar vacío.
- `description` puede ser `null`, vacía o texto recortado según la convención elegida, pero debe manejarse de forma consistente.
- `completed` debe tener valor por defecto `false`.
- Las operaciones `find`, `update` y `delete` deben filtrar por `id` y `userId`.
- No aceptar `userId` desde formularios.
- Si una tarea no existe o no pertenece al usuario autenticado, responder como no encontrada o redirigir con mensaje seguro; no revelar que pertenece a otro usuario.

## 10. Validación con Zod

Toda entrada de formularios debe validarse con Zod antes de llegar a Prisma.

Schemas esperados:

- Registro:
  - `name`: string requerido, recortado, longitud mínima razonable.
  - `email`: string requerido, formato email, normalizado.
  - `password`: string requerido, longitud mínima razonable para el contexto académico.
- Login:
  - `email`: string requerido, formato email, normalizado.
  - `password`: string requerido.
- Tarea:
  - `title`: string requerido, recortado, no vacío.
  - `description`: string opcional, recortado.
  - `completed`: booleano o valor de checkbox transformado a booleano.

Reglas:

- Usar `safeParse` en controladores o helpers cercanos al controlador.
- En caso de error, volver a renderizar el formulario con:
  - mensajes de validación;
  - valores seguros previamente ingresados;
  - código HTTP 400 cuando corresponda.
- No duplicar validaciones manuales que ya están en Zod salvo para reglas de negocio, como email único o propiedad de una tarea.
- Mantener los mensajes comprensibles para estudiantes y evaluadores.

## 11. Manejo de errores

Reglas:

- Los errores esperados deben manejarse cerca del caso de uso:
  - validación inválida;
  - credenciales incorrectas;
  - email duplicado;
  - tarea inexistente;
  - acceso no autenticado.
- Los errores inesperados deben pasar al middleware central de errores con `next(error)`.
- No mostrar stack traces en vistas.
- Renderizar una vista de error simple para fallos generales.
- Renderizar una vista 404 o redirigir de forma segura cuando un recurso no exista.
- No silenciar errores de Prisma sin decisión explícita.
- No convertir todos los errores en 200; usar 400, 401, 403, 404 o 500 según corresponda cuando el flujo lo permita.

## 12. Reglas para vistas Handlebars

Reglas:

- Usar layout principal para estructura común: `html`, `head`, navegación y contenedor principal.
- Usar parciales solo si reducen duplicación real.
- Mantener formularios HTML simples con `method="POST"` para mutaciones.
- Mostrar errores de validación cerca del formulario.
- Mantener valores ingresados por el usuario cuando la validación falle, excepto contraseñas.
- No mostrar contraseña ni hash en ninguna vista.
- La navegación debe reflejar estado de sesión:
  - usuario no autenticado: links a login y registro;
  - usuario autenticado: link a tareas y formulario/botón de logout.
- No depender de JavaScript para registrar, iniciar sesión, cerrar sesión o completar CRUD.
- Usar `{{variable}}` para salida escapada.
- Evitar `{{{variable}}}` salvo contenido generado por la aplicación y previamente sanitizado.

## 13. Estrategia de pruebas y verificación

La verificación debe demostrar comportamiento observable, no solo ausencia de errores de compilación.

Antes de entregar cambios funcionales, el agente debe verificar según el tipo de cambio:

- Cambios de autenticación:
  - registrar usuario;
  - iniciar sesión;
  - cerrar sesión;
  - confirmar que rutas protegidas redirigen o bloquean sin sesión.
- Cambios de tareas:
  - crear tarea;
  - listar tarea;
  - editar tarea;
  - marcar estado si aplica;
  - eliminar tarea;
  - confirmar aislamiento por usuario cuando se toque autorización.
- Cambios de validación:
  - enviar datos inválidos;
  - confirmar mensajes de error y que no se persisten datos inválidos.
- Cambios de vistas:
  - abrir la ruta afectada;
  - confirmar renderizado y formularios principales.

Comandos y herramientas:

- Usar scripts existentes del proyecto cuando existan.
- No crear una suite compleja si el proyecto no la tiene.
- Para evaluación académica, una prueba manual documentada o smoke test local puede ser suficiente si cubre el flujo modificado.
- Si se agregan tests automatizados, deben cubrir contratos visibles y fallar ante errores reales.

## 14. Flujo de trabajo que debe seguir el agente antes de modificar código

Antes de editar código, el agente debe:

1. Leer la solicitud completa y confirmar el alcance real.
2. Revisar la estructura existente del proyecto.
3. Identificar archivos relevantes antes de abrirlos.
4. Leer solo las secciones necesarias.
5. Reutilizar convenciones existentes del proyecto.
6. Verificar si ya existe una implementación parcial antes de crear otra.
7. Planificar cambios mínimos y directos.
8. No instalar dependencias sin instrucción explícita.
9. No generar archivos que no aporten al requisito.
10. No modificar configuración global salvo que sea imprescindible para que el requisito funcione.

Durante la edición:

- Cambiar primero el punto fuente del problema.
- Mantener controladores, servicios, schemas y vistas con responsabilidades separadas.
- Migrar todos los callsites afectados si se cambia una interfaz interna.
- Eliminar código obsoleto si deja de usarse.
- No dejar `TODO`, stubs, mocks ni rutas incompletas como solución final.

Después de editar:

- Ejecutar la verificación específica del flujo cambiado.
- Revisar que no se hayan modificado archivos fuera del alcance.
- Explicar qué cambió y cómo se verificó.

## 15. Restricciones para evitar sobreingeniería

Este proyecto debe priorizar la solución más simple que funcione.

Prohibido salvo requisito explícito:

- Microservicios.
- Arquitectura hexagonal completa.
- CQRS.
- Event sourcing.
- Repositorios genéricos sobre Prisma sin beneficio real.
- Contenedores Docker obligatorios para desarrollo local.
- Frontend SPA.
- API REST paralela al flujo HTML.
- Autenticación JWT para sesiones de navegador.
- Sistema de roles avanzado.
- Abstracciones preventivas para casos no pedidos.
- Helpers globales difíciles de rastrear.
- Generadores de código propios.

Permitido y preferido:

- Controladores claros.
- Servicios pequeños cuando reduzcan duplicación o separen lógica de negocio.
- Schemas Zod por formulario.
- Middleware de autenticación simple.
- Consultas Prisma directas y legibles.
- Vistas Handlebars simples.

## 16. Definición de terminado

Una tarea se considera terminada solo si cumple todo lo siguiente:

- El flujo solicitado funciona de extremo a extremo.
- La implementación respeta Node.js, TypeScript, Express, Handlebars, Prisma, SQLite, `express-session`, `bcryptjs` y Zod.
- La arquitectura MVC sigue separada.
- Las rutas protegidas no son accesibles sin sesión.
- Las tareas quedan aisladas por usuario.
- Las contraseñas se guardan hasheadas y nunca se renderizan.
- Los formularios validan entrada con Zod.
- Los errores esperados muestran respuestas comprensibles.
- No se introdujeron dependencias innecesarias.
- No hay stubs, mocks, `TODO: implement`, rutas muertas ni código duplicado innecesario.
- Se ejecutó una verificación adecuada al cambio.
- La respuesta final del agente indica archivos modificados y verificación realizada.

## 17. Reglas para documentación y commits

Documentación:

- Mantener documentación breve y útil para ejecutar, evaluar y mantener la aplicación.
- No crear documentación nueva si no fue solicitada o si duplica información existente.
- Actualizar documentación existente solo cuando el comportamiento, comandos o estructura cambien.
- Escribir documentación del proyecto en español salvo que el archivo existente use otro idioma de forma consistente.

Commits:

- No crear commits automáticamente salvo instrucción explícita del usuario.
- No modificar historial de Git.
- No ejecutar comandos destructivos de Git.
- Si el usuario pide un commit, usar mensaje breve, específico y en modo imperativo.
- Antes de sugerir un commit, verificar que los cambios corresponden solo al alcance solicitado.
