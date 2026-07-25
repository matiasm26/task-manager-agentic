import type { Response } from "express";
import type { SessionData } from "express-session";
import type { RequestHandler } from "express";

import { listTasksByUser } from "../services/task.service";

type TaskFormState = {
  errors: Partial<Record<"title" | "description" | "dueDate", string>>;
  values: {
    description: string;
    dueDate: string;
    title: string;
  };
};

const emptyTaskForm: TaskFormState = {
  errors: {},
  values: {
    description: "",
    dueDate: "",
    title: "",
  },
};

const formatTaskDate = (date: Date | null) => {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

export const renderDashboard = async (
  res: Response,
  user: NonNullable<SessionData["user"]>,
  status = 200,
  taskForm = emptyTaskForm,
) => {
  const tasks = await listTasksByUser(user.id);

  res.status(status).render("dashboard", {
    taskForm,
    tasks: tasks.map((task) => ({
      ...task,
      dueDateLabel: formatTaskDate(task.dueDate),
    })),
    title: "Dashboard",
    user,
  });
};

export const showDashboard: RequestHandler = async (req, res, next) => {
  const sessionUser = req.session.user;

  if (!sessionUser) {
    res.redirect("/auth/login");
    return;
  }

  try {
    await renderDashboard(res, sessionUser);
  } catch (error) {
    next(error);
  }
};
