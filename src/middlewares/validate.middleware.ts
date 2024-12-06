import Joi, { ObjectSchema } from "joi";
import { Context, Next } from "koa";
import { sendErrorResponse } from "../helpers/response.modifier";
import { ValidationError } from "../errors/customErrors";

export const validate = (schema: { body?: ObjectSchema; params?: ObjectSchema; query?: ObjectSchema }) => {
    return async (ctx: Context, next: Next) => {
        try {
            if (schema.body) {
                const body = ctx.request.body;
                const { error } = await schema.body.validate(body);
                if (error) {
                    throw new ValidationError(`Validation failed in body: ${error.details.map((e: any) => e.message).join(', ')}`);
                }
            }

            if (schema.params) {
                const params = ctx.params;
                const { error } = await schema.params.validate(params);
                if (error) {
                    throw new ValidationError(`Validation failed in params: ${error.details.map((e: any) => e.message).join(', ')}`);
                }
            }

            if (schema.query) {
                const query = ctx.request.query;
                const { error } = await schema.query.validate(query);
                if (error) {
                    throw new ValidationError(`Validation failed in query: ${error.details.map((e: any) => e.message).join(', ')}`);
                }
            }

            await next();
        } catch (error: any) {
            sendErrorResponse(ctx, new ValidationError(error.message));
        }
    };
};

