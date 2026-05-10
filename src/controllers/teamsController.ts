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

  async deleteTeam(request: Request, response: Response, next: NextFunction) {
    const teamId = Number(request.params.teamId);

    if (!teamId) {
      throw new AppError("teamId not sent");
    }

    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new AppError("team not exists", 404);
    }

    await prisma.teams.delete({
      where: {
        id: teamId,
      },
    });

    return response.status(204).json();
  }

  async updateTeam(request: Request, response: Response, next: NextFunction) {
    const teamId = Number(request.params.teamId);

    if (!teamId) {
      throw new AppError("teamId not sent");
    }

    const bodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    });

    const { name, description } = bodySchema.parse(request.body);

    if (!(name || description)) {
      throw new AppError("Name or Description not sent");
    }

    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new AppError("team not exists", 404);
    }

    const data: {
      name?: string;
      description?: string;
    } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (description !== undefined) {
      data.description = description;
    }

    const teamUpdated = await prisma.teams.update({
      where: {
        id: teamId,
      },
      data,
    });

    return response.json(teamUpdated);
  }
}

export { TeamsController };
