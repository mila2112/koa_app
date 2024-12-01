import { Context, Next } from 'koa';

export async function errorMiddleware(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err : any) {
        console.error('Error occurred:', err);

        if (err instanceof SyntaxError) {
            ctx.status = 400;
            ctx.body = { message: 'Invalid JSON format' };
        } else {
            ctx.status = err.status || 500;
            ctx.body = {
                message: err.message || 'Internal server error',
                error: err.name || 'InternalError',
                stack: process.env.NODE_ENV === 'development' ? err.stack : null,
            };
        }
    }
}

