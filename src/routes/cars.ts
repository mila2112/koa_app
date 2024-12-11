import Router from "koa-router";
import carsController from "../controllers/cars.controller";
import { jwtAuth, permit, validateUserAccess } from "../middlewares/passportStrategies";
import { validate } from "../middlewares/validate.middleware";
import { validationSchemas } from "../validations/validationSchemas";
import { Roles } from "../types/index";

const carsRouter = new Router();

carsRouter.prefix('/users/:userId');

carsRouter.get("/cars", jwtAuth, permit([Roles.User, Roles.Admin]), validateUserAccess, validate(validationSchemas.getUsersCarsListSchema), carsController.getUsersCarsList);

carsRouter.get("/cars/:id", jwtAuth, permit([Roles.User, Roles.Admin]), validateUserAccess, validate(validationSchemas.getUserCarByIdSchema), carsController.getUserCarById);

carsRouter.post("/cars", jwtAuth, permit([Roles.User, Roles.Admin]), validateUserAccess, validate(validationSchemas.createCarSchema), carsController.createCar);
carsRouter.put("/cars/:id", jwtAuth, permit([Roles.User, Roles.Admin]), validateUserAccess, validate(validationSchemas.editCarSchema), carsController.editCar);

carsRouter.delete("/cars/:id", jwtAuth, permit([Roles.User, Roles.Admin]), validateUserAccess, validate(validationSchemas.deleteCarSchema), carsController.deleteCar);

export default carsRouter;