import { Context } from 'koa';
import {CustomError, ErrorStatus} from "../errors/customErrors";

interface ApiResponse<T> {
    result: T;
}

export const sendResponse = <T>(
    ctx: Context,
    result: T,
    status = 200,
): void => {
    const response: ApiResponse<T> = {
        result,
    };

    ctx.status = status;
    ctx.body = response;
};

export const sendErrorResponse = <T>(ctx: Context, error: any): void => {
    if (error instanceof CustomError) {
        ctx.status = error.statusCode;
        ctx.body = {
            result: {
                message: error.message,
                cause: error.cause,
                statusCode: error.statusCode,
                status: error.status,
                name: error.name,
            },
        };
    } else {
        ctx.status = 500;
        ctx.body = {
            result: {
                message: 'Internal server error',
                status: ErrorStatus.InternalError,
            },
        };
    }
}

