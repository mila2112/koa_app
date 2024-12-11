import Router from "koa-router";
import makesController from "../controllers/makes.controller";
import { jwtAuth, permit } from "../middlewares/passportStrategies";
import { Roles } from "../types/index";

const makesRouter = new Router();

makesRouter.prefix("/makes");

makesRouter.get("/", jwtAuth, permit([Roles.User, Roles.Admin]), makesController.getCarsMakes);

export default makesRouter;