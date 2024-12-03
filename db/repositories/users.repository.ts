import { PrismaClient } from "@prisma/client";
import { DatabaseErrorFactory } from "../../src/errors/customErrors";

const prisma = new PrismaClient();

class UsersRepository {
    async createUser(fullName: string, email: string, password: string, phone?: string, role?: string) {
        try {
            return await prisma.user.create({
                data: {
                    email,
                    password,
                    fullName,
                    phone,
                    role
                },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    role: true,
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

    async deleteUser(id: number) {
        return await prisma.user.delete({
            where: { id },
        });
    }
}

export const usersRepository = new UsersRepository();


