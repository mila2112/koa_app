import {Prisma, Car } from "@prisma/client";
import { DatabaseErrorFactory, NotFoundError, ValidationError } from "../../src/errors/customErrors";
import { prisma } from "../prisma/index";

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
        } catch (error: any) {
            console.log(error);

            if (error instanceof NotFoundError) {
                throw error;
            }
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Failed to create car');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async findCarById(id: number, userId: number) {
        try {
            return await prisma.car.findUnique({
                where: { id, userId },
            });
        } catch (error) {
            console.log(error);
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
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving all cars list.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }


    async findUsersCars(userId: number, { skip, take }: Prisma.CarFindManyArgs): Promise<Car[]>  {
        try {
            return await prisma.car.findMany({
                where: { userId },
                skip: skip,
                take: take,
                include: {
                    make: true,
                    model: true,
                },
            });
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error retrieving user\'s cars list.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async getTotalCarsCount() {
        try {
            return await prisma.car.count();
        } catch (error) {
            console.log(error);
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
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error counting user\'s cars.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async editCar(carId: number, userId: number, data: Prisma.CarUncheckedUpdateInput) {
        try {
            const updateData: Prisma.CarUpdateInput = {
                year: data.year ?? undefined,
                price: data.price ?? undefined,
                vin: data.vin ?? undefined,
            };

            if (data.modelId) {
                updateData.model = { connect: { id: data.modelId as number } };
            }

            if (data.makeId) {
                updateData.make = { connect: { id: data.makeId as number} };
            }

            return await prisma.car.update({
                where: {
                    id: carId,
                    userId,
                },
                data: updateData,
            });
        } catch (error: any) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ValidationError('A car with this VIN already exists');
                }
            }
            if (error instanceof NotFoundError) {
                throw error;
            }
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error editing car.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

    async deleteCar(id : number, userId: number) {
        try {
            return await prisma.car.delete({
                where: {
                    id,
                    userId
                },
            });
        } catch (error) {
            console.log(error);
            const errorData = DatabaseErrorFactory.createErrorData(error, 'Error deleting car.');
            throw DatabaseErrorFactory.from(errorData);
        }
    }

}

export const carsRepository = new CarsRepository();