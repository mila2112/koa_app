import Router from "koa-router";
import usersController from "../controllers/users.controller";
import passport from "koa-passport";
import { jwtAuth, permit } from "../middlewares/passportStrategies";
import { validate } from "../middlewares/validate.middleware";
import { validationSchemas } from "../validations/validationSchemas";
import { Roles } from "../types/index";

const usersRouter = new Router();

usersRouter.prefix("/users");

usersRouter.post("/sign-up", validate(validationSchemas.signUpSchema), usersController.signUp);
usersRouter.post("/sign-in",  validate(validationSchemas.signInSchema), passport.authenticate('local', { session: false }), usersController.signIn);

usersRouter.get("/", jwtAuth, validate(validationSchemas.getUsersSchema), usersController.getUsers);

usersRouter.delete("/:id", jwtAuth, permit([Roles.Admin]), validate(validationSchemas.deleteUserSchema), usersController.deleteUser);

export default usersRouter;

