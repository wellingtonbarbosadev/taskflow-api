import { Router } from "express";
import { TeamsController } from "../controllers/teamsController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization";

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.use(ensureAuthenticated, verifyUserAuthorization(["member"]));
teamsRoutes.get("/", teamsController.listAll);

export { teamsRoutes };
