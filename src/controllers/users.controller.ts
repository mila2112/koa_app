import { Context } from 'koa';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersRepository } from '../../db/repositories/users.repository';
import {ValidationError, UnauthorizedError, NotFoundError} from '../errors/customErrors';
import { sendErrorResponse, sendResponse } from '../helpers/response.modifier';
import { SignUpRequest } from 'index';
import passport from "koa-passport";
import * as process from "node:process";

class UsersController {
    async signUp(ctx: Context) {
        try {
            let { fullName, phone, email, password, role } = ctx.request.body as SignUpRequest;

            const existingUser = await usersRepository.findByEmail(email);
            if (existingUser) {
                throw new ValidationError('User with this email already exists');
            }

            password = await bcrypt.hash(password, 10);
            const user = await usersRepository.createUser({fullName, email, password, phone, role});

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
                    { id: user.id, email: user.email, role: user.role },
                    process.env.JWT_SECRET!,
                    { expiresIn: '1h' }
                );

                sendResponse(ctx, { message: 'Logged in successfully', token, id: user.id, role: user.role } );
            })(ctx, next);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }


    async getUsers(ctx: Context) {
        try {
            const page = Number(ctx.request.query.page) || 1;
            const take = Number(ctx.request.query.pageSize) || 10;

            const skip = (page - 1) * take;
            const users = await usersRepository.getAllUsers({skip, take});
            const totalUsers = await usersRepository.getTotalUsersCount();
            const totalPages = Math.ceil(totalUsers / take);

            sendResponse(ctx, {users, totalCount: totalUsers, totalPages, currentPage: page, take});
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async deleteUser(ctx: Context) {
        try {
            const { id } = ctx.params;

            const user = await usersRepository.findById(Number(id));
            if (!user) {
                throw new NotFoundError('User not found');
            }

            await usersRepository.deleteUser(Number(id));

            sendResponse(ctx, { message: 'User has been successfully deleted.' });
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }


}

export default new UsersController();


