import Router from "koa-router";
import usersController from "../controllers/users.controller";
import passport from "koa-passport";
import { jwtAuth } from "../middlewares/passportStrategies";

const usersRouter = new Router();

usersRouter.post("/sign-up", usersController.signUp);
usersRouter.post("/sign-in",  passport.authenticate('local', { session: false }), usersController.signIn);

usersRouter.get("/users", jwtAuth, usersController.getUsers);

export default usersRouter;

