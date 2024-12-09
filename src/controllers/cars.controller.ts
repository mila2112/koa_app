import { Context } from 'koa';
import { sendErrorResponse, sendResponse } from '../helpers/response.modifier';
import { CreateCarRequest, EditCarRequest, GetUserCarByIdRequest } from 'index';
import { carsRepository } from "../../db/repositories/cars.repository";
import { NotFoundError, ValidationError } from "../errors/customErrors";
import { Roles }  from "../types/index";

class CarsController {
    async createCar(ctx: Context) {
        try {
            const reqUserId = ctx.state.user.id;
            const userRole = ctx.state.user.role;
            let { year, vin, price, makeId, modelId, userId } = ctx.request.body as CreateCarRequest;

            if (userRole ===  Roles.Admin && !userId) {
                throw new ValidationError('UserId is required for admin');
            }

            userId = userRole === 'admin' ? userId : reqUserId;

            const car = await carsRepository.createCar(
                { year, price, vin, userId: userId!, modelId, makeId }
            );

            sendResponse(ctx, { car }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async editCar(ctx: Context) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body as EditCarRequest;
            const reqUserId = ctx.state.user.id;
            const userRole = ctx.state.user.role;

            if (userRole === Roles.User && data.userId) {
                throw new ValidationError('User cannot change userId');
            }

            const car = await carsRepository.findCarById(Number(id));

            if(!car || (userRole === Roles.User && car.userId !== reqUserId)) {
                throw new NotFoundError('Car not found');
            }

            const updatedCar = await carsRepository.editCar(Number(id), data);

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

            const car = await carsRepository.findCarById(id);

            if(!car || (userRole === Roles.User && car.userId !== reqUserId)) {
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

            const car = await carsRepository.findCarById(id);

            if(!car || (userRole === Roles.User && car.userId !== reqUserId)) {
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