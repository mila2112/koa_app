import { PrismaClient } from "@prisma/client";
import {DatabaseError, DatabaseErrorFactory} from "../../src/errors/customErrors";

const prisma = new PrismaClient();

class UsersRepository {
    async createUser(email: string, password: string) {
        try {
            return await prisma.user.create({
                data: { email, password },
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                },
            });
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Failed to create user');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async findByEmail(email: string) {
        try {
            return await prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving user by email.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async findById(id: number) {
        try {
            return prisma.user.findUnique({
                where: { id },
            });

        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving user by ID.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async getAllUsers({ skip, limit }: { skip: number; limit: number }) {
        try {
            return prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            });
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving users.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async getTotalUsersCount() {
        try {
            return await prisma.user.count();
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving users count.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }
}

export const usersRepository = new UsersRepository();


