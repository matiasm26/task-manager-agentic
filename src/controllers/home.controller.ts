import type { RequestHandler } from "express";

export const showHome: RequestHandler = (_req, res) => {
  res.render("home", {
    appName: "Task Manager Agentic",
    title: "Inicio",
  });
};
