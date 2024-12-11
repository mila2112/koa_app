import { Model } from "@prisma/client";
import { DatabaseErrorFactory } from "../../src/errors/customErrors";
import { prisma } from "../prisma/index";

class ModelsRepository {
    async getCarsModelsByMakeId(id: number): Promise<Model[]> {
        try {
           return await prisma.model.findMany({
               where: { makeId: id },
           });
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Failed retrieving models list.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }
}

export const modelsRepository = new ModelsRepository();