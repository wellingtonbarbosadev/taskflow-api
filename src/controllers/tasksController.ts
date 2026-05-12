import type { Request, Response, NextFunction } from "express";
import z from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";

enum Status {
  pending = "pending",
  in_progress = "in_progress",
  completed = "completed",
}

enum Priority {
  high = "high",
  medium = "medium",
  low = "low",
}

class TasksController {
  async listTasks(request: Request, response: Response, next: NextFunction) {
    const querySchema = z.object({
      status: z.enum(Status).optional(),
      priority: z.enum(Priority).optional(),
    });

    const { status, priority } = querySchema.parse(request.query);

    const tasks = await prisma.tasks.findMany({
      where: {
        status,
        priority,
        assignedTo:
          request.user?.role === "member"
            ? Number(request.user?.id)
            : undefined,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return response.json(tasks);
  }

  async editTask(request: Request, response: Response, next: NextFunction) {
    const taskId = Number(request.params.taskId);

    const bodySchema = z.object({
      title: z.string().max(200).optional(),
      description: z.string().max(200).optional(),
      status: z.enum(Status).optional(),
      priority: z.enum(Priority).optional(),
      assignedTo: z.number().optional(),
      teamId: z.number().optional(),
    });

    const { title, description, status, priority, assignedTo, teamId } =
      bodySchema.parse(request.body);

    if (assignedTo) {
      const user = await prisma.user.findFirst({
        where: {
          id: assignedTo,
        },
      });

      if (!user) {
        throw new AppError("this user not exists", 404);
      }
    }

    if (teamId) {
      const team = await prisma.teams.findFirst({
        where: {
          id: teamId,
        },
      });

      if (!team) {
        throw new AppError("this team not exists", 404);
      }
    }

    const task = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (
      request.user?.role === "member" &&
      task.assignedTo !== Number(request.user.id)
    ) {
      throw new AppError("Unauthorized", 401);
    }

    let data = {};

    if (request.user?.role === "admin") {
      data = {
        title,
        description,
        status,
        priority,
        assignedTo,
        teamId,
      };
    } else {
      data = {
        status,
      };
    }

    const updatedTask = await prisma.tasks.update({
      where: {
        id: taskId,
      },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (task.status !== updatedTask.status) {
      await prisma.tasksHistory.create({
        data: {
          taskId: task.id,
          oldStatus: task.status,
          newStatus: updatedTask.status,
          changedBy: Number(request.user?.id),
        },
      });
    }

    return response.json(updatedTask);
  }

  async createTask(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      title: z.string().max(200),
      description: z.string().max(200),
      status: z.enum(Status),
      priority: z.enum(Priority),
      assignedTo: z.number(),
      teamId: z.number(),
    });

    const { title, description, status, priority, assignedTo, teamId } =
      bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        id: assignedTo,
      },
    });

    if (!user) {
      throw new AppError("this user not exists", 404);
    }

    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new AppError("this team not exists", 404);
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        status,
        priority,
        assignedTo: user.id,
        teamId: team.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return response.status(201).json(task);
  }

  async deleteTask(request: Request, response: Response, next: NextFunction) {
    const taskId = Number(request.params.taskId);

    const task = await prisma.tasks.findFirst({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new AppError("this task don't exists", 404);
    }

    await prisma.tasks.delete({
      where: {
        id: taskId,
      },
    });

    return response.status(204).json();
  }
}

export { TasksController };
