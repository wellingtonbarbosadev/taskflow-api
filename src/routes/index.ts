import { Router } from "express";
import { userRoutes } from "./userRoutes.js";
import { sessionsRoutes } from "./sessionsRoutes.js";
import { teamsRoutes } from "./teamsRoutes.js";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/teams", teamsRoutes);

export { routes };
