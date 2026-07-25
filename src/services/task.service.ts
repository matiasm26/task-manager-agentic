import { prisma } from "../prisma/client";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";

const taskSelect = {
  createdAt: true,
  description: true,
  dueDate: true,
  id: true,
  priority: true,
  status: true,
  title: true,
} as const;

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

export const deleteTaskForUser = async (taskId: number, userId: number) => {
  return prisma.task.deleteMany({
    where: {
      id: taskId,
      userId,
    },
  });
};

export const findTaskByIdForUser = async (taskId: number, userId: number) => {
  return prisma.task.findFirst({
    select: taskSelect,
    where: {
      id: taskId,
      userId,
    },
  });
};

export const listTasksByUser = async (userId: number) => {
  return prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: taskSelect,
    where: {
      userId,
    },
  });
};

export const updateTaskForUser = async (taskId: number, userId: number, input: UpdateTaskInput) => {
  return prisma.task.updateMany({
    data: {
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      priority: input.priority,
      status: input.status,
      title: input.title,
    },
    where: {
      id: taskId,
      userId,
    },
  });
};
