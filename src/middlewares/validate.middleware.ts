import Joi, { ObjectSchema } from "joi";
import { Context, Next } from "koa";
import {sendErrorResponse} from "../helpers/response.modifier";
import {ValidationError} from "../errors/customErrors";

export const validate = (schema: { body?: ObjectSchema; params?: ObjectSchema; query?: ObjectSchema }) => {
    return async (ctx: Context, next: Next) => {
        try {
            if (schema.body) {
                const body = ctx.request.body;
                await schema.body.validateAsync(body);
            }

            if (schema.params) {
                const params = ctx.params;
                await schema.params.validateAsync(params);
            }

            if (schema.query) {
                const query = ctx.request.query;
                await schema.query.validateAsync(query);
            }

            await next();
        } catch (error: any) {
            sendErrorResponse(ctx, new ValidationError("Validation failed.", error));
        }
    };
};
