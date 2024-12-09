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

            userId = userRole === Roles.Admin ? userId : reqUserId;

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

            const { id } = ctx.params;

            const car = await carsRepository.findCarById(Number(id));

            if(!car || (userRole === Roles.User && car.userId !== reqUserId)) {
                throw new NotFoundError('Car not found');
            }

            sendResponse(ctx, { car }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }

    async getCarsList(ctx: Context) {
        try {
            const reqUserId = ctx.state.user.id;
            const userRole = ctx.state.user.role;

            const page = Number(ctx.request.query.page) || 1;
            const pageSize = Number(ctx.request.query.pageSize) || 10;

            const skip = (page - 1) * pageSize;
            const take = pageSize;

            let cars;
            let totalCars;

            if (userRole === Roles.Admin) {
                cars = await carsRepository.findAllCars({ skip, take });
                totalCars = await carsRepository.getTotalCarsCount();
            } else {
                cars = await carsRepository.findUsersCars(reqUserId, { skip, take });
                totalCars = await carsRepository.getUsersCarsCount(reqUserId);
            }

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