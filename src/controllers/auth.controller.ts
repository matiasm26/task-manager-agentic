import type { Request, RequestHandler, Response } from "express";
import type { ZodError } from "zod";

import { SESSION_COOKIE_NAME } from "../config/session";
import {
  DuplicateEmailError,
  InvalidCredentialsError,
  authenticateUser,
  createRegisteredUser,
} from "../services/auth.service";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

type AuthField = "email" | "password";
type RegisterField = "name" | "email" | "password" | "passwordConfirmation";
type AuthFormErrors = Partial<Record<AuthField | "form", string>>;
type RegisterFormErrors = Partial<Record<RegisterField, string>>;
type EmailFormValues = {
  email: string;
};
type RegisterFormValues = EmailFormValues & {
  name: string;
};

const authFields: AuthField[] = ["email", "password"];
const registerFields: RegisterField[] = ["name", "email", "password", "passwordConfirmation"];

const getSafeEmailValue = (body: unknown): EmailFormValues => {
  if (!body || typeof body !== "object") {
    return { email: "" };
  }

  const formBody = body as Record<string, unknown>;
  const email = typeof formBody.email === "string" ? formBody.email.trim().toLowerCase() : "";

  return { email };
};

const getSafeRegisterValues = (body: unknown): RegisterFormValues => {
  if (!body || typeof body !== "object") {
    return { email: "", name: "" };
  }

  const formBody = body as Record<string, unknown>;
  const name = typeof formBody.name === "string" ? formBody.name.trim() : "";
  const email = typeof formBody.email === "string" ? formBody.email.trim().toLowerCase() : "";

  return { email, name };
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

    const formField = field as Field;

    if (!errors[formField]) {
      errors[formField] = issue.message;
    }
  }

  return errors;
};

const regenerateSession = (req: Request) =>
  new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const saveSession = (req: Request) =>
  new Promise<void>((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const renderLogin = (
  res: Response,
  status: number,
  values: EmailFormValues = { email: "" },
  errors: AuthFormErrors = {},
) => {
  res.status(status).render("auth/login", {
    errors,
    title: "Inicio de sesión",
    values,
  });
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
    renderRegister(res, 400, getSafeRegisterValues(req.body), getZodErrors(parsedRegister.error, registerFields));
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

export const showLoginForm: RequestHandler = (_req, res) => {
  renderLogin(res, 200);
};

export const loginUser: RequestHandler = async (req, res, next) => {
  const parsedLogin = loginSchema.safeParse(req.body);

  if (!parsedLogin.success) {
    renderLogin(res, 400, getSafeEmailValue(req.body), getZodErrors(parsedLogin.error, authFields));
    return;
  }

  try {
    const user = await authenticateUser(parsedLogin.data);
    await regenerateSession(req);

    req.session.user = {
      id: user.id,
      name: user.name,
    };

    await saveSession(req);
    res.redirect(303, "/dashboard");
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      renderLogin(res, 400, {
        email: parsedLogin.data.email,
      }, {
        form: error.message,
      });
      return;
    }

    next(error);
  }
};

export const logoutUser: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.redirect(303, "/auth/login");
  });
};
