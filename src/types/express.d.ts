type UserRoles = "admin" | "member";

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: UserRoles;
    };
  }
}
