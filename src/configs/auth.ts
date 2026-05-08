import jwt from "jsonwebtoken";
import { env } from "../env";

const JWT_SECRET = env.JWT_SECRET;

export function generateToken(userId: number) {
  return jwt.sign(
    {
      sub: userId,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
