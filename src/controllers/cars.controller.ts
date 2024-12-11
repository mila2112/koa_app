import { Context } from 'koa';
import { sendErrorResponse, sendResponse } from '../helpers/response.modifier';
import { CreateCarRequest, EditCarRequest, GetUserCarByIdRequest } from 'index';
import { carsRepository } from "../../db/repositories/cars.repository";
import { NotFoundError, ValidationError } from "../errors/customErrors";
import { Roles }  from "../types/index";

class CarsController {

    async createCar(ctx: Context) {
        try {
            const { userId } = ctx.params;
            let { year, vin, price, makeId, modelId } = ctx.request.body as CreateCarRequest;

            const car = await carsRepository.createCar(
                { year, price, vin, userId: +userId, modelId, makeId }
            );

            sendResponse(ctx, { car }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async editCar(ctx: Context) {
        try {
            const { id, userId } = ctx.params;
            const { data } = ctx.request.body as EditCarRequest;

            const car = await carsRepository.findCarById(Number(id), Number(userId));

            if(!car) {
                throw new NotFoundError('Car not found');
            }

            const updatedCar = await carsRepository.editCar(Number(id), Number(userId),  data);

            sendResponse(ctx, { updatedCar }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async getUserCarById(ctx: Context) {
        try {
            const { id, userId } = ctx.params;

            const car = await carsRepository.findCarById(Number(id), Number(userId));

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
            const { userId } = ctx.params;
            const page = Number(ctx.request.query.page) || 1;
            const pageSize = Number(ctx.request.query.pageSize) || 10;

            const skip = (page - 1) * pageSize;
            const take = pageSize;

            const cars = await carsRepository.findUsersCars(Number(userId), { skip, take });
            const totalCars = await carsRepository.getUsersCarsCount(Number(userId));

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
            const { id, userId} = ctx.params;

            const car = await carsRepository.findCarById(Number(id), Number(userId));

            if(!car) {
                throw new NotFoundError('Car not found');
            }

            await carsRepository.deleteCar(Number(id), Number(userId));

            sendResponse(ctx, { message:  'You have successfully delete car' }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }
}

export default new CarsController();