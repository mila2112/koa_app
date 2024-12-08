import Router from "koa-router";
import carsController from "../controllers/cars.controller";
import {jwtAuth, permit} from "../middlewares/passportStrategies";
import {validate} from "../middlewares/validate.middleware";
import {validationSchemas} from "../validations/validationSchemas";

const carsRouter = new Router();

carsRouter.prefix('/cars');

carsRouter.get("/", jwtAuth, permit(["user", "admin"]), validate(validationSchemas.getUserCarByIdSchema), carsController.getUserCarById);
carsRouter.post("/", jwtAuth, permit(["user", "admin"]), validate(validationSchemas.createCarSchema), carsController.createCar);
carsRouter.put("/", jwtAuth, permit(["user", "admin"]), validate(validationSchemas.editCarSchema), carsController.editCar);

carsRouter.delete("/:id", jwtAuth, permit(["user","admin"]), validate(validationSchemas.deleteCarSchema), carsController.deleteCar);

export default carsRouter;