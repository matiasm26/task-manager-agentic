import type { RequestHandler } from "express";
import type { ZodError } from "zod";

import { renderDashboard } from "./dashboard.controller";
import { createTaskForUser } from "../services/task.service";
import { createTaskSchema } from "../schemas/task.schema";

type TaskField = "title" | "description" | "dueDate";
type TaskFormErrors = Partial<Record<TaskField, string>>;
type TaskFormValues = Record<TaskField, string>;

const taskFields: TaskField[] = ["title", "description", "dueDate"];

const getTaskFormValues = (body: unknown): TaskFormValues => {
  if (!body || typeof body !== "object") {
    return { description: "", dueDate: "", title: "" };
  }

  const formBody = body as Record<string, unknown>;
  const title = typeof formBody.title === "string" ? formBody.title.trim() : "";
  const description = typeof formBody.description === "string" ? formBody.description.trim() : "";
  const dueDate = typeof formBody.dueDate === "string" ? formBody.dueDate.trim() : "";

  return { description, dueDate, title };
};

const getZodErrors = (error: ZodError): TaskFormErrors => {
  const errors: TaskFormErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    if (!taskFields.includes(field as TaskField)) {
      continue;
    }

    const taskField = field as TaskField;

    if (!errors[taskField]) {
      errors[taskField] = issue.message;
    }
  }

  return errors;
};

export const createTask: RequestHandler = async (req, res, next) => {
  const sessionUser = req.session.user;

  if (!sessionUser) {
    res.redirect("/auth/login");
    return;
  }

  const parsedTask = createTaskSchema.safeParse(req.body);

  if (!parsedTask.success) {
    await renderDashboard(res, sessionUser, 400, {
      errors: getZodErrors(parsedTask.error),
      values: getTaskFormValues(req.body),
    });
    return;
  }

  try {
    await createTaskForUser(sessionUser.id, parsedTask.data);
    res.redirect(303, "/dashboard");
  } catch (error) {
    next(error);
  }
};
