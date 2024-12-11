import { Context } from 'koa';
import { sendErrorResponse, sendResponse } from '../helpers/response.modifier';
import { makesRepository } from "../../db/repositories/makes.repository";

class MakesController {
    async getCarsMakes(ctx: Context) {
        try {
            const makes = await makesRepository.getCarsMakes();

            sendResponse(ctx, { makes }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }
}

export default new MakesController();