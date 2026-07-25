import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "../prisma/client";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";

const BCRYPT_ROUNDS = 10;

export class DuplicateEmailError extends Error {
  constructor() {
    super("Ya existe una cuenta registrada con este email.");
    this.name = "DuplicateEmailError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Credenciales inválidas.");
    this.name = "InvalidCredentialsError";
  }
}

const isUniqueEmailConstraintError = (error: unknown) => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  const target = error.meta?.target;

  return error.code === "P2002" && Array.isArray(target) && target.includes("email");
};


export const authenticateUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new InvalidCredentialsError();
  }

  return {
    id: user.id,
    name: user.name,
  };
};
export const createRegisteredUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new DuplicateEmailError();
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  try {
    return await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
      },
      select: {
        createdAt: true,
        email: true,
        id: true,
        name: true,
      },
    });
  } catch (error) {
    if (isUniqueEmailConstraintError(error)) {
      throw new DuplicateEmailError();
    }

    throw error;
  }
};
