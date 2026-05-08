import type { Request, Response } from "express";
import { prisma } from "../database/prisma.js";

class SessionsController {
  login(request: Request, response: Response) {
    return response.json("OK");
  }

  async register(request: Request, response: Response) {
    return response.json("OK");
  }
}

export { SessionsController };
