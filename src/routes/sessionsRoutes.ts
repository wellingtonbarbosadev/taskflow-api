import { Router } from "express";
import { SessionsController } from "../controllers/sessionsController";

const sessionsRoutes = Router();
const sessionsController = new SessionsController();

sessionsRoutes.get("/sessions", sessionsController.login);
sessionsRoutes.post("/sessions", sessionsController.register);

export { sessionsRoutes };
