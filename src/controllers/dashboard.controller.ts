import type { RequestHandler } from "express";

export const showDashboard: RequestHandler = (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    user: req.session.user,
  });
};
