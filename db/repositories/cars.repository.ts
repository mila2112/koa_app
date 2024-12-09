import {Prisma, PrismaClient, Car } from "@prisma/client";
import { DatabaseErrorFactory, NotFoundError } from "../../src/errors/customErrors";
import { EditCarRequest } from "index";

const prisma = new PrismaClient();

class CarsRepository {
    async createCar(data: Prisma.CarUncheckedCreateInput) {
        try {
            const make = await prisma.make.findUnique({
                where: { id: data.makeId },
                include: {
                    models: true,
                },
            });

            if (!make) {
                throw new NotFoundError('Make not found');
            }

            const modelExists = make.models.some((model) => model.id === data.modelId);

            if (!modelExists) {
                throw new NotFoundError('Model not found for this make');
            }

            return await prisma.car.create({
                data: {
                    year: data.year,
                    price: data.price,
                    vin: data.vin,
                    user: {
                        connect: {
                            id: data.userId,
                        },
                    },
                    model: {
                        connect: { id: data.modelId },
                    },
                    make: {
                        connect: { id: data.makeId },
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

    async findAllCars({ skip, take }: Prisma.CarFindManyArgs): Promise<Car[]> {
        try {
            return await prisma.car.findMany({
                skip: skip,
                take: take
            });
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving all cars list.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }


    async findUsersCars(userId: number, { skip, take }: Prisma.CarFindManyArgs): Promise<Car[]>  {
        try {
            return await prisma.car.findMany({
                where: { userId },
                skip: skip,
                take: take
            });
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving user\'s cars list.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async getTotalCarsCount() {
        try {
            return await prisma.car.count();
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error counting all cars.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async getUsersCarsCount(userId: number) {
        try {
            return await prisma.car.count({
                where: { userId }
            });
        } catch (error) {
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error counting user\'s cars.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async editCar(carId: number, data: Prisma.CarUncheckedUpdateInput) {
        try {
            if (data.userId) {
                const userExists = await prisma.user.findUnique({
                    where: { id: data.userId as number },
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