import { Router } from "express";
import { userRoutes } from "./userRoutes.js";
import { sessionsRoutes } from "./sessionsRoutes.js";
import { teamsRoutes } from "./teamsRoutes.js";
import { tasksRoutes } from "./tasksRoutes.js";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/teams", teamsRoutes);
routes.use("/tasks", tasksRoutes);

export { routes };
