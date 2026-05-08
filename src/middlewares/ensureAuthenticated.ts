import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { env } from "../env";

interface JwtPayload {
  sub: string;
  role: UserRoles;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const headers = request.headers.authorization;

    if (!headers) {
      throw new AppError("Unauthorized", 401);
    }

    const [, token] = headers.split(" ");

    const { JWT_SECRET } = env;
    const { role, sub: user_id } = jwt.verify(
      token ?? "",
      JWT_SECRET,
    ) as JwtPayload;
    request.user = {
      id: user_id,
      role,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid JWT Token", 401);
  }
}

export { ensureAuthenticated };
