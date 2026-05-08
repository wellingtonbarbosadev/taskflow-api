import type { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import z from "zod";

class UserController {
  login(request: Request, response: Response) {
    return response.json("OK");
  }

  async register(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string(),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    return response.json({ name, email, password });
  }
}

export { UserController };
