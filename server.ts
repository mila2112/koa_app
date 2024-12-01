import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { koaSwagger } from "koa2-swagger-ui";
import swaggerSpec from "./swagger";
import userRoutes from "./src/routes/users.routes";
import Router from "koa-router";
import { errorMiddleware } from "./src/middlewares/errorMiddleware";
import dotenv from "dotenv";
import passport from "koa-passport";
import { jwtStrategy, localStrategy } from "./src/middlewares/passportStrategies";
const app = new Koa();
const router = new Router();
dotenv.config();

app.use(bodyParser());

app.use(passport.initialize());

localStrategy();
jwtStrategy();

app.use(errorMiddleware);

router.get("/swagger.json", async (ctx) => {
    ctx.body = swaggerSpec;
});

router.get("/swagger", koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
        url: '/swagger.json',
    }
}));

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


