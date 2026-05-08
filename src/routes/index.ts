import { Router } from "express";
import { userRoutes } from "./userRoutes.js";
import { sessionsRoutes } from "./sessionsRoutes.js";

const routes = Router();

routes.use(userRoutes);
routes.use(sessionsRoutes);

export { routes };
