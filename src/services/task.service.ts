import { prisma } from "../prisma/client";
import type { CreateTaskInput } from "../schemas/task.schema";

export const createTaskForUser = async (userId: number, input: CreateTaskInput) => {
  return prisma.task.create({
    data: {
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      title: input.title,
      userId,
    },
    select: {
      id: true,
    },
  });
};

export const listTasksByUser = async (userId: number) => {
  return prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
      description: true,
      dueDate: true,
      id: true,
      priority: true,
      status: true,
      title: true,
    },
    where: {
      userId,
    },
  });
};
