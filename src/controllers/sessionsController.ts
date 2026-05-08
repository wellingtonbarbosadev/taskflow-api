import type { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import jwt from "jsonwebtoken";
import z, { email } from "zod";
import { hash, compare } from "bcrypt-ts";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../configs/auth.js";

class SessionsController {
  async login(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError("email or password incorrect");
    }

    if (!(await compare(password, user.password))) {
      throw new AppError("email or password incorrect");
    }

    const token = generateToken(user.id);

    return response.json(token);
  }
}

export { SessionsController };
