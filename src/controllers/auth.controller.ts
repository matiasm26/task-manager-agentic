import type { RequestHandler, Response } from "express";
import type { ZodError } from "zod";

import { DuplicateEmailError, createRegisteredUser } from "../services/auth.service";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";

type RegisterField = "name" | "email" | "password" | "passwordConfirmation";
type RegisterFormErrors = Partial<Record<RegisterField, string>>;
type RegisterFormValues = {
  email: string;
  name: string;
};

const registerFields: RegisterField[] = ["name", "email", "password", "passwordConfirmation"];

const getSafeRegisterValues = (body: unknown): RegisterFormValues => {
  if (!body || typeof body !== "object") {
    return { email: "", name: "" };
  }

  const formBody = body as Record<string, unknown>;
  const name = typeof formBody.name === "string" ? formBody.name.trim() : "";
  const email = typeof formBody.email === "string" ? formBody.email.trim().toLowerCase() : "";

  return { email, name };
};

const getZodErrors = (error: ZodError<RegisterInput>): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    if (!registerFields.includes(field as RegisterField)) {
      continue;
    }

    const registerField = field as RegisterField;

    if (!errors[registerField]) {
      errors[registerField] = issue.message;
    }
  }

  return errors;
};

const renderRegister = (
  res: Response,
  status: number,
  values: RegisterFormValues = { email: "", name: "" },
  errors: RegisterFormErrors = {},
) => {
  res.status(status).render("auth/register", {
    errors,
    title: "Registro",
    values,
  });
};

export const showRegisterForm: RequestHandler = (_req, res) => {
  renderRegister(res, 200);
};

export const registerUser: RequestHandler = async (req, res, next) => {
  const parsedRegister = registerSchema.safeParse(req.body);

  if (!parsedRegister.success) {
    renderRegister(res, 400, getSafeRegisterValues(req.body), getZodErrors(parsedRegister.error));
    return;
  }

  try {
    await createRegisteredUser(parsedRegister.data);
    res.redirect(303, "/auth/login");
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      renderRegister(res, 400, {
        email: parsedRegister.data.email,
        name: parsedRegister.data.name,
      }, {
        email: error.message,
      });
      return;
    }

    next(error);
  }
};

export const showLoginPlaceholder: RequestHandler = (_req, res) => {
  res.render("auth/login", {
    title: "Inicio de sesión",
  });
};
