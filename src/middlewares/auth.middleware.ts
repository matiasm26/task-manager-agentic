import type { RequestHandler } from "express";

export const exposeCurrentUser: RequestHandler = (req, res, next) => {
  res.locals.currentUser = req.session.user ?? null;
  next();
};

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.session.user) {
    next();
    return;
  }

  res.redirect("/auth/login");
};

export const redirectAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/dashboard");
    return;
  }

  next();
};
