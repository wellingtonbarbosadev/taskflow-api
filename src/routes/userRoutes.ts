import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/users", userController.login);
userRoutes.post("/users", userController.register);

export { userRoutes };
