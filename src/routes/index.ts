import { Router } from "express";
import { userRoutes } from "./userRoutes.js";

const routes = Router();

routes.use(userRoutes);

export { routes };
