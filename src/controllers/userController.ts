import type { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import z from "zod";
import { AppError } from "../utils/AppError.js";

class UserController {
  async listAllUsers(request: Request, response: Response) {
    const users = await prisma.user.findMany();
    return response.json(users);
  }

  async register(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string(),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const emailAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (emailAlreadyExists) {
      throw new AppError("this email already exists");
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return response.status(201).json(user);
  }
}

export { UserController };
