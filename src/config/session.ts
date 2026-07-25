import session from "express-session";

export const SESSION_COOKIE_NAME = "task_manager_sid";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("Falta SESSION_SECRET. Define esta variable en .env antes de iniciar la aplicación.");
}

export const sessionMiddleware = session({
  name: SESSION_COOKIE_NAME,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});
