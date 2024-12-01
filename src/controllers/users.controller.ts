import { Context } from 'koa';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersRepository } from '../../db/repositories/users.repository';
import { ValidationError, UnauthorizedError } from '../errors/customErrors';
import { sendErrorResponse, sendResponse } from '../helpers/response.modifier';
import { SignUpRequest } from 'index';
import passport from "koa-passport";
import * as process from "node:process";

class UsersController {
    async signUp(ctx: Context) {
        try {
            const { email, password } = ctx.request.body as SignUpRequest;

            if (!email || !password) {
                throw new ValidationError('Email and password are required');
            }

            const existingUser = await usersRepository.findByEmail(email);
            if (existingUser) {
                throw new ValidationError('User with this email already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await usersRepository.createUser( email, hashedPassword);

            sendResponse(ctx, { user }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async signIn(ctx: Context, next: () => Promise<any>) {
        try {
            return passport.authenticate('local', async (err, user, info) => {
                if (err || !user) {
                    return sendErrorResponse(ctx, new UnauthorizedError('Authentication failed'));
                }

                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET!,
                    { expiresIn: '1h' }
                );

                sendResponse(ctx, { message: 'Logged in successfully', token });
            })(ctx, next);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }


    async getUsers(ctx: Context) {
        try {
            const page = Number(ctx.request.query.page) || 1;
            const limit = Number(ctx.request.query.limit) || 10;

            const skip = (page - 1) * limit;
            const users = await usersRepository.getAllUsers({skip, limit});
            const totalUsers = await usersRepository.getTotalUsersCount();
            const totalPages = Math.ceil(totalUsers / limit);

            sendResponse(ctx, {users, totalCount: totalUsers, totalPages, currentPage: page, limit});
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

}

export default new UsersController();


