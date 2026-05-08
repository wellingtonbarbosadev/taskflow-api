import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/", userController.listAllUsers);
userRoutes.post("/", userController.register);

export { userRoutes };
