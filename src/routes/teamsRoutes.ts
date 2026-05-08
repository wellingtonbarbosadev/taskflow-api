import { Router } from "express";
import { TeamsController } from "../controllers/teamsController";

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.get("/", teamsController.listAll);

export { teamsRoutes };
