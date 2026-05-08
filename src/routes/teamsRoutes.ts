import { Router } from "express";
import { TeamsController } from "../controllers/teamsController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.get("/", ensureAuthenticated, teamsController.listAll);

export { teamsRoutes };
