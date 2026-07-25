import { TaskPriority, TaskStatus } from "@prisma/client";
import type { RequestHandler, Response } from "express";
import type { ZodError } from "zod";

import { renderDashboard } from "./dashboard.controller";
import {
  createTaskForUser,
  deleteTaskForUser,
  findTaskByIdForUser,
  updateTaskForUser,
} from "../services/task.service";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "../schemas/task.schema";

type TaskField = "title" | "description" | "dueDate";
type UpdateTaskField = TaskField | "status" | "priority";
type TaskFormErrors = Partial<Record<TaskField, string>>;
type UpdateTaskFormErrors = Partial<Record<UpdateTaskField, string>>;
type TaskFormValues = Record<TaskField, string>;
type UpdateTaskFormValues = Record<UpdateTaskField, string>;

const taskFields: TaskField[] = ["title", "description", "dueDate"];
const updateTaskFields: UpdateTaskField[] = ["title", "description", "dueDate", "status", "priority"];

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

const getUpdateTaskFormValues = (body: unknown): UpdateTaskFormValues => {
  if (!body || typeof body !== "object") {
    return {
      description: "",
      dueDate: "",
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      title: "",
    };
  }

  const formBody = body as Record<string, unknown>;
  const title = typeof formBody.title === "string" ? formBody.title.trim() : "";
  const description = typeof formBody.description === "string" ? formBody.description.trim() : "";
  const dueDate = typeof formBody.dueDate === "string" ? formBody.dueDate.trim() : "";
  const status = typeof formBody.status === "string" ? formBody.status : "";
  const priority = typeof formBody.priority === "string" ? formBody.priority : "";

  return { description, dueDate, priority, status, title };
};

const getZodErrors = <Field extends string>(error: ZodError, fields: Field[]) => {
  const errors: Partial<Record<Field, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    if (!fields.includes(field as Field)) {
      continue;
    }

    const taskField = field as Field;

    if (!errors[taskField]) {
      errors[taskField] = issue.message;
    }
  }

  return errors;
};

const formatDateInput = (date: Date | null) => {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const getPriorityOptions = (currentPriority: string) => {
  return [
    { label: "Baja", selected: currentPriority === TaskPriority.LOW, value: TaskPriority.LOW },
    { label: "Media", selected: currentPriority === TaskPriority.MEDIUM, value: TaskPriority.MEDIUM },
    { label: "Alta", selected: currentPriority === TaskPriority.HIGH, value: TaskPriority.HIGH },
  ];
};

const getStatusOptions = (currentStatus: string) => {
  return [
    { label: "Pendiente", selected: currentStatus === TaskStatus.PENDING, value: TaskStatus.PENDING },
    { label: "En progreso", selected: currentStatus === TaskStatus.IN_PROGRESS, value: TaskStatus.IN_PROGRESS },
    { label: "Completada", selected: currentStatus === TaskStatus.COMPLETED, value: TaskStatus.COMPLETED },
  ];
};

const renderEditForm = (
  res: Response,
  status: number,
  taskId: number,
  values: UpdateTaskFormValues,
  errors: UpdateTaskFormErrors = {},
) => {
  res.status(status).render("tasks/edit", {
    errors,
    priorityOptions: getPriorityOptions(values.priority),
    statusOptions: getStatusOptions(values.status),
    task: {
      id: taskId,
      ...values,
    },
    title: "Editar tarea",
  });
};

const renderTaskNotFound = (res: Response) => {
  res.status(404).render("not-found", {
    title: "Tarea no encontrada",
  });
};

export const createTask: RequestHandler = async (req, res, next) => {
  const sessionUser = req.session.user;

  if (!sessionUser) {
    res.redirect("/auth/login");
    return;
  }

  const parsedTask = createTaskSchema.safeParse(req.body);

  if (!parsedTask.success) {
    try {
      await renderDashboard(res, sessionUser, 400, {
        errors: getZodErrors(parsedTask.error, taskFields),
        values: getTaskFormValues(req.body),
      });
    } catch (error) {
      next(error);
    }
    return;
  }

  try {
    await createTaskForUser(sessionUser.id, parsedTask.data);
    res.redirect(303, "/dashboard");
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  const sessionUser = req.session.user;
  const parsedTaskId = taskIdSchema.safeParse(req.params.id);

  if (!sessionUser) {
    res.redirect("/auth/login");
    return;
  }

  if (!parsedTaskId.success) {
    renderTaskNotFound(res);
    return;
  }

  try {
    const result = await deleteTaskForUser(parsedTaskId.data, sessionUser.id);

    if (result.count === 0) {
      renderTaskNotFound(res);
      return;
    }

    res.redirect(303, "/dashboard");
  } catch (error) {
    next(error);
  }
};

export const showEditTaskForm: RequestHandler = async (req, res, next) => {
  const sessionUser = req.session.user;
  const parsedTaskId = taskIdSchema.safeParse(req.params.id);

  if (!sessionUser) {
    res.redirect("/auth/login");
    return;
  }

  if (!parsedTaskId.success) {
    renderTaskNotFound(res);
    return;
  }

  try {
    const task = await findTaskByIdForUser(parsedTaskId.data, sessionUser.id);

    if (!task) {
      renderTaskNotFound(res);
      return;
    }

    renderEditForm(res, 200, task.id, {
      description: task.description ?? "",
      dueDate: formatDateInput(task.dueDate),
      priority: task.priority,
      status: task.status,
      title: task.title,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  const sessionUser = req.session.user;
  const parsedTaskId = taskIdSchema.safeParse(req.params.id);

  if (!sessionUser) {
    res.redirect("/auth/login");
    return;
  }

  if (!parsedTaskId.success) {
    renderTaskNotFound(res);
    return;
  }

  const taskId = parsedTaskId.data;
  const parsedTask = updateTaskSchema.safeParse(req.body);

  if (!parsedTask.success) {
    renderEditForm(res, 400, taskId, getUpdateTaskFormValues(req.body), getZodErrors(parsedTask.error, updateTaskFields));
    return;
  }

  try {
    const result = await updateTaskForUser(taskId, sessionUser.id, parsedTask.data);

    if (result.count === 0) {
      renderTaskNotFound(res);
      return;
    }

    res.redirect(303, "/dashboard");
  } catch (error) {
    next(error);
  }
};
