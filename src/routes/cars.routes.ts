import Router from "koa-router";
import carsController from "../controllers/cars.controller";
import {jwtAuth, permit} from "../middlewares/passportStrategies";
import {validate} from "../middlewares/validate.middleware";
import {validationSchemas} from "../validations/validationSchemas";
import {Roles} from "../types/index";

const carsRouter = new Router();

carsRouter.prefix('/cars');

carsRouter.get("/", jwtAuth, permit([Roles.User, Roles.Admin]), validate(validationSchemas.getUserCarByIdSchema), carsController.getUserCarById);
carsRouter.post("/", jwtAuth, permit([Roles.User, Roles.Admin]), validate(validationSchemas.createCarSchema), carsController.createCar);
carsRouter.put("/:id", jwtAuth, permit([Roles.User, Roles.Admin]), validate(validationSchemas.editCarSchema), carsController.editCar);

carsRouter.delete("/:id", jwtAuth, permit([Roles.User, Roles.Admin]), validate(validationSchemas.deleteCarSchema), carsController.deleteCar);

export default carsRouter;