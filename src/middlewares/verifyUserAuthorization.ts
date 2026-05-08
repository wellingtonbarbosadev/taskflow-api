import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

type UserRoles = "admin" | "member";

function verifyUserAuthorization(roles: UserRoles[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!roles.includes(request.user.role)) {
      throw new AppError("Unauthorized", 401);
    }

    return next();
  };
}

export { verifyUserAuthorization };
