import passport from "koa-passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from 'passport-local';
import { usersRepository } from "../../db/repositories/users.repository";
import { UnauthorizedError } from "../errors/customErrors";
import bcrypt from "bcryptjs";
import {Context, Next} from "koa";
import { sendErrorResponse } from "../helpers/response.modifier";
import {Roles} from "../types/index";
import { isTokenBlacklisted } from "../helpers/tokenBlacklist";

export const localStrategy = () => {
    passport.use(
    'local',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await usersRepository.findByEmail(email);

                if (!user) {
                    return done(new UnauthorizedError('Invalid email or password'), false);
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(new UnauthorizedError('Invalid email or password'), false);
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);
};

export const jwtStrategy = () => {
    try {
        passport.use(
            new JwtStrategy(
                {
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                    secretOrKey: process.env.JWT_SECRET || 'shh',
                },
                async (jwt_payload, done) => {
                    try {
                        const user = await usersRepository.findById(jwt_payload.id);
                        if (!user) return done(new UnauthorizedError('User not found'), false);

                        return done(null, user);
                    } catch (err) {
                        return done(new UnauthorizedError('Failed to authenticate user'), false);
                    }
                }
            )
        );
    } catch (err) {
        console.error("Error in setting up JWT strategy:", err);
        throw new Error('Failed to initialize JWT authentication strategy');
    }
};

export const jwtAuth = async (ctx: Context, next: () => Promise<any>) => {
    const token = ctx.headers['authorization']?.split(' ')[1];  // Extract token from "Authorization" header

    if (token && isTokenBlacklisted(token)) {
        return sendErrorResponse(ctx, new UnauthorizedError('Token is invalidated'));
    }

    return passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return sendErrorResponse(ctx, new UnauthorizedError('Authentication failed'));
        }

        ctx.state.user = user;
        return next();
    })(ctx, next);
};

export const permit = (roles: string[]) => {
    return async (ctx: Context, next: () => Promise<any>) => {
        const user = ctx.state.user;

        if (!roles.includes(user.role)) {
            return sendErrorResponse(ctx, new UnauthorizedError("You do not have permission to access this resource"));
        }

        await next();
    };
};

export const validateUserAccess = async (ctx: Context, next: Next) => {
    const user = ctx.state.user;

    const { userId } = ctx.params;

    if (user.role === Roles.User && Number(userId) !== user.id) {
        return sendErrorResponse(ctx, new UnauthorizedError("You are not authorized to access this resource"));
    }

    await next();
};











