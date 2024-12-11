import { Context } from 'koa';
import { sendErrorResponse, sendResponse } from '../helpers/response.modifier';
import { modelsRepository } from "../../db/repositories/models.repository";

class ModelsController {
    async getCarsModels(ctx: Context) {
        try {
            const { id } = ctx.params;
            const models = await modelsRepository.getCarsModelsByMakeId(Number(id));

            sendResponse(ctx, { models }, 201);
        } catch (error) {
            sendErrorResponse(ctx, error);
        }
    }
}

export default new ModelsController();