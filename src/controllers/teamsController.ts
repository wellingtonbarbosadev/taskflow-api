import type { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma";

class TeamsController {
  async listAll(request: Request, response: Response, next: NextFunction) {
    const teams = await prisma.teams.findMany();

    return response.json(teams);
  }
}

export { TeamsController };
