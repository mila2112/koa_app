import { PrismaClient, Prisma, User } from "@prisma/client";
import { DatabaseErrorFactory } from "../../src/errors/customErrors";

const prisma = new PrismaClient();

class UsersRepository {
    async createUser(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
        try {
            return await prisma.user.create({
                data,
                omit: { password: true },
            });
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Failed to create user');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving user by email.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { id },
            });
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving user by ID.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async getAllUsers({ skip, take }: Prisma.UserFindManyArgs): Promise<Omit<User, 'password'>[]> {
        try {
            return await prisma.user.findMany({
                skip,
                take,
                omit: { password: true },
            });
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving users.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }


    async getTotalUsersCount(): Promise<number> {
        try {
            return await prisma.user.count();
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving users count.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async deleteUser(id: number): Promise<User> {
        try {
            return await prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error deleting user.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }
}

export const usersRepository = new UsersRepository();



