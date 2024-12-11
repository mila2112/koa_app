import { PrismaClient, Prisma, Make } from "@prisma/client";
import { DatabaseErrorFactory } from "../../src/errors/customErrors";

const prisma = new PrismaClient();

class MakesRepository {
    async getCarsMakes() : Promise<Make[]> {
        try {
            return await prisma.make.findMany({});
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Failed retrieving makes list.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }
}

export const makesRepository = new MakesRepository();