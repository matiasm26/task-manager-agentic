import "dotenv/config";

import app from "./app";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL. Copia .env.example a .env antes de iniciar la aplicación.");
}

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
