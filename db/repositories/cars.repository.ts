import { PrismaClient } from "@prisma/client";
import { DatabaseErrorFactory, NotFoundError } from "../../src/errors/customErrors";
import { EditCarRequest } from "index";

const prisma = new PrismaClient();

class CarsRepository {
    async createCar(year: number, price: number, vin: string, userId: number, modelId: number, makeId: number) {
        try {
            const make = await prisma.make.findUnique({
                where: { id: makeId },
                include: {
                    models: true,
                },
            });

            if (!make) {
                throw new NotFoundError('Make not found');
            }

            const modelExists = make.models.some((model) => model.id === modelId);

            if (!modelExists) {
                throw new NotFoundError('Model not found for this make');
            }

            return await prisma.car.create({
                data: {
                    year,
                    price,
                    vin,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                    model: {
                        connect: { id: modelId },
                    },
                    make: {
                        connect: { id: makeId },
                    },
                },
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Failed to create car');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async findCarById(id: number) {
        try {
            return await prisma.car.findUnique({
                where: { id },
            });
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving car by id.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async editCar(carId: number, data: EditCarRequest['data']) {
        try {
            if (data.userId) {
                const userExists = await prisma.user.findUnique({
                    where: { id: data.userId },
                });

                if (!userExists) {
                    throw new NotFoundError(`User not found`);
                }
            }

            const updatedCar = await prisma.car.update({
                where: {
                    id: carId,
                },
                data: {
                    year: data.year ?? undefined,
                    price: data.price ?? undefined,
                    vin: data.vin ?? undefined,
                    modelId: data.modelId ?? undefined,
                    makeId: data.makeId ?? undefined,
                    userId: data.userId ?? undefined,
                },
            });

            return updatedCar;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error editing car.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }


    async deleteCar(id : number) {
        try {
            return await prisma.car.delete({
                where: {
                    id
                },
            });
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error deleting car.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

}

export const carsRepository = new CarsRepository();