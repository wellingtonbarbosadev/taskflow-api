import type { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma";
import z from "zod";
import { AppError } from "../utils/AppError";

class TeamsController {
  async listAll(request: Request, response: Response, next: NextFunction) {
    const teams = await prisma.teams.findMany();

    return response.json(teams);
  }

  async createTeam(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string().max(100),
      description: z.string().max(500),
    });

    const { name, description } = bodySchema.parse(request.body);

    const teamWithSameName = await prisma.teams.findFirst({
      where: {
        name,
      },
    });

    if (teamWithSameName) {
      throw new AppError("team with same name already exists.");
    }

    const team = await prisma.teams.create({
      data: {
        name,
        description,
      },
    });

    return response.status(201).json(team);
  }
}

export { TeamsController };
