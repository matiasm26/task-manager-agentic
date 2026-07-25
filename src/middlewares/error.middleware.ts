import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).render("not-found", {
    title: "Página no encontrada",
  });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  res.status(500).render("error", {
    message: "Ocurrió un error inesperado.",
    title: "Error del servidor",
  });
};
