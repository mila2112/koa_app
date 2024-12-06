import { Context } from 'koa';
import { sendErrorResponse, sendResponse } from '../helpers/response.modifier';
import { CreateCarRequest, DeleteCarRequest, EditCarRequest, GetUserCarByIdRequest } from 'index';
import { carsRepository } from "../../db/repositories/cars.repository";
import {NotFoundError, ValidationError} from "../errors/customErrors";

class CarsController {
    async createCar(ctx: Context) {
        try {
            const reqUserId = ctx.state.user.id;
            const userRole = ctx.state.user.role;
            const { year, vin, price, makeId, modelId, userId } = ctx.request.body as CreateCarRequest;

            if (userRole === 'admin' && !userId) {
                throw new ValidationError('UserId is required for admin');
            }

            const finalUserId = userRole === 'admin' ? userId : reqUserId;

            const car = await carsRepository.createCar(
                year, price, vin, finalUserId, modelId, makeId
            );

            sendResponse(ctx, { car }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async editCar(ctx: Context) {
        try {
            const { id, data } = ctx.request.body as EditCarRequest;
            const reqUserId = ctx.state.user.id;
            const userRole = ctx.state.user.role;


            const car = userRole === 'admin'
                ? await carsRepository.findCarById(id)
                : await carsRepository.findCarById(id, reqUserId);

            if(!car) {
                throw new NotFoundError('Car not found');
            }

            if (userRole !== 'admin') {
                delete data.userId;
            }

            const updatedCar = await carsRepository.editCar(id, data);

            sendResponse(ctx, { updatedCar }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async getUserCarById(ctx: Context) {
        try {
            const reqUserId = ctx.state.user.id;
            const userRole = ctx.state.user.role;

            const { id } = ctx.request.body as GetUserCarByIdRequest;

            const car = userRole === 'admin'
                ? await carsRepository.findCarById(id)
                : await carsRepository.findCarById(id, reqUserId);

            if(!car) {
                throw new NotFoundError('Car not found');
            }

            sendResponse(ctx, { car }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async deleteCar(ctx: Context) {
        try {
            const { id } = ctx.params;

            const reqUserId = ctx.state.user.id;
            const userRole = ctx.state.user.role;

            const car = userRole === 'admin'
                ? await carsRepository.findCarById(Number(id))
                : await carsRepository.findCarById(Number(id), reqUserId);

            if(!car) {
                throw new NotFoundError('Car not found');
            }

            await carsRepository.deleteCar(Number(id));

            sendResponse(ctx, { message:  'You have successfully delete car' }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }
}

export default new CarsController();