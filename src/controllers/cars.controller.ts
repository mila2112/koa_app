import { Context } from 'koa';
import { sendErrorResponse, sendResponse } from '../helpers/response.modifier';
import { CreateCarRequest, EditCarRequest } from 'index';
import { carsRepository } from "../../db/repositories/cars.repository";
import { NotFoundError } from "../errors/customErrors";

class CarsController {

    async createCar(ctx: Context) {
        try {
            const userId = Number.parseInt(ctx.params.userId);
            let { year, vin, price, makeId, modelId } = ctx.request.body as CreateCarRequest;

            const car = await carsRepository.createCar(
                { year, price, vin, userId, modelId, makeId }
            );

            sendResponse(ctx, { car }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async editCar(ctx: Context) {
        try {
            const userId = Number.parseInt(ctx.params.userId);
            const id = Number.parseInt(ctx.params.id);
            const { data } = ctx.request.body as EditCarRequest;

            const car = await carsRepository.findCarById(id, userId);

            if(!car) {
                throw new NotFoundError('Car not found');
            }

            const updatedCar = await carsRepository.editCar(id, userId, data);

            sendResponse(ctx, { updatedCar }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async getUserCarById(ctx: Context) {
        try {
            const userId = Number.parseInt(ctx.params.userId);
            const id = Number.parseInt(ctx.params.id);

            const car = await carsRepository.findCarById(id, userId);

            if(!car) {
                throw new NotFoundError('Car not found');
            }

            sendResponse(ctx, { car }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async getUsersCarsList(ctx: Context) {
        try {
            const userId = Number.parseInt(ctx.params.userId);
            const page = Number(ctx.request.query.page) || 1;
            const pageSize = Number(ctx.request.query.pageSize) || 10;

            const skip = (page - 1) * pageSize;
            const take = pageSize;

            const cars = await carsRepository.findUsersCars(userId, { skip, take });
            const totalCars = await carsRepository.getUsersCarsCount(userId);

            const totalPages = Math.ceil(totalCars / pageSize);

            sendResponse(ctx, {
                cars,
                totalCount: totalCars,
                totalPages,
                currentPage: page,
                pageSize: take
            }, 200);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async deleteCar(ctx: Context) {
        try {
            const userId = Number.parseInt(ctx.params.userId);
            const id = Number.parseInt(ctx.params.id);

            const car = await carsRepository.findCarById(id, userId);

            if(!car) {
                throw new NotFoundError('Car not found');
            }

            await carsRepository.deleteCar(id, userId);

            sendResponse(ctx, { message:  'You have successfully delete car' }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }
}

export default new CarsController();