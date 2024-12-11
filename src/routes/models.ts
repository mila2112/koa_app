import Router from "koa-router";
import modelsController from "../controllers/models.controller";
import { jwtAuth, permit } from "../middlewares/passportStrategies";
import { Roles } from "../types/index";
import {validate} from "../middlewares/validate.middleware";
import {validationSchemas} from "../validations/validationSchemas";

const modelsRouter = new Router();

modelsRouter.prefix("/models");

modelsRouter.get("/:id", jwtAuth, permit([Roles.User, Roles.Admin]), validate(validationSchemas.getModelsByMakeIdSchema), modelsController.getCarsModels);

export default modelsRouter;