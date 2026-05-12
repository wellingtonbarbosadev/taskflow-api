import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization";
import { TasksController } from "../controllers/tasksController";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.use(ensureAuthenticated);

tasksRoutes.get("/", tasksController.listTasks);
tasksRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  tasksController.createTask,
);
tasksRoutes.patch("/:taskId", tasksController.editTask);
tasksRoutes.delete(
  "/:taskId",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  tasksController.deleteTask,
);

export { tasksRoutes };
