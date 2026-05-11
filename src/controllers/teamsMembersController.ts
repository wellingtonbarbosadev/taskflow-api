import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../database/prisma";

class TeamsMembersController {
  async listMemberOnTeam(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const teamId = Number(request.params.teamId);

    const team = await prisma.teams.findFirst({ where: { id: teamId } });

    if (!team) {
      throw new AppError("team not exists");
    }

    const members = await prisma.teamMembers.findMany({
      where: {
        teamId,
      },
      select: {
        id: true,
        user: {
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

    if (members.length === 0) {
      throw new AppError("team don't have members");
    }

    return response.json(members);
  }

  async addMemberOnTeam(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const teamId = Number(request.params.teamId);
    const userId = Number(request.params.userId);

    if (!teamId) {
      throw new AppError("teamId not sent");
    }

    if (!userId) {
      throw new AppError("userId not sent");
    }

    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!team) {
      throw new AppError("team not exists", 404);
    }

    if (!user) {
      throw new AppError("user not exists", 404);
    }

    const teamMembers = await prisma.teamMembers.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    if (teamMembers) {
      throw new AppError("User already in this team");
    }

    const teamUpdated = await prisma.teamMembers.create({
      data: {
        teamId,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            name: true,
          },
        },
      },
    });

    return response.json(teamUpdated);
  }

  async removeMemberOnTeam(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const teamId = Number(request.params.teamId);
    const userId = Number(request.params.userId);

    if (!teamId) {
      throw new AppError("teamId not sent");
    }

    if (!userId) {
      throw new AppError("userId not sent");
    }

    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!team) {
      throw new AppError("team not exists", 404);
    }

    if (!user) {
      throw new AppError("user not exists", 404);
    }

    const teamMembers = await prisma.teamMembers.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    if (!teamMembers) {
      throw new AppError("User not in this team");
    }

    await prisma.teamMembers.delete({
      where: {
        id: teamMembers.id,
      },
    });

    return response.status(204).json();
  }
}

export { TeamsMembersController };
