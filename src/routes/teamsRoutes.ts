import { Router } from "express";
import { TeamsController } from "../controllers/teamsController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization";
import { TeamsMembersController } from "../controllers/teamsMembersController";

const teamsRoutes = Router();
const teamsController = new TeamsController();
const teamsMembersController = new TeamsMembersController();

teamsRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]));

teamsRoutes.get("/", teamsController.listAll);
teamsRoutes.post("/", teamsController.createTeam);
teamsRoutes.delete("/:teamId", teamsController.deleteTeam);
teamsRoutes.patch("/:teamId", teamsController.updateTeam);

teamsRoutes.get("/:teamId/member", teamsMembersController.listMemberOnTeam);
teamsRoutes.post(
  "/:teamId/member/:userId",
  teamsMembersController.addMemberOnTeam,
);
teamsRoutes.delete(
  "/:teamId/member/:userId",
  teamsMembersController.removeMemberOnTeam,
);

export { teamsRoutes };
