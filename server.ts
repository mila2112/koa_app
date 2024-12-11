import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { koaSwagger } from "koa2-swagger-ui";
import userRoutes from "./src/routes/users";
import Router from "koa-router";
import { errorMiddleware } from "./src/middlewares/error.middleware";
import dotenv from "dotenv";
import passport from "koa-passport";
import { jwtStrategy, localStrategy } from "./src/middlewares/passportStrategies";
import carsRoutes from "./src/routes/cars";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import cors from "@koa/cors";
import makesRouter from "./src/routes/makes";
import modelsRouter from "./src/routes/models";


const app = new Koa();
const router = new Router();
dotenv.config();

app.use(bodyParser());

app.use(passport.initialize());

localStrategy();
jwtStrategy();

app.use(errorMiddleware);

const swaggerYaml = yaml.load(fs.readFileSync(path.resolve(__dirname, './docs/swagger.yaml'), 'utf8'));

router.get("/swagger.json", async (ctx) => {
    ctx.body = swaggerYaml;
});

router.get("/swagger", koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
        url: '/swagger.json',
    }
}));

app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.use(carsRoutes.routes());
app.use(carsRoutes.allowedMethods());

app.use(makesRouter.routes());
app.use(makesRouter.allowedMethods());

app.use(modelsRouter.routes());
app.use(modelsRouter.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


