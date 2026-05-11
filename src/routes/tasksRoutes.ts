import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization";
import { TasksController } from "../controllers/tasksController";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]));

tasksRoutes.get("/", tasksController.listTasks);
tasksRoutes.post("/", tasksController.createTask);
tasksRoutes.patch("/:taskId", tasksController.editTask);
tasksRoutes.delete("/:taskId", tasksController.deleteTask);

export { tasksRoutes };
