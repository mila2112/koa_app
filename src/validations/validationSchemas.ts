import Joi from "joi";

export const validationSchemas = {
    signUpSchema: {
        body: Joi.object({
            fullName: Joi.string().min(3).max(100).required(),
            phone: Joi.string().optional(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid("user", "admin").optional(),
        }),
    },

    signInSchema: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
    },

    getUsersSchema: {
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            pageSize: Joi.number().integer().min(1).default(10)
        }),
    },

    createCarSchema: {
        params: Joi.object({
            userId: Joi.number().positive().required(),
        }),
        body: Joi.object({
            year: Joi.number().integer().positive().required(),
            price: Joi.number().positive().required(),
            vin: Joi.string().alphanum().length(17).required(),
            modelId: Joi.number().positive().required(),
            makeId: Joi.number().positive().required()
        }),
    },

    editCarSchema: {
        params: Joi.object({
            userId: Joi.number().positive().required(),
            id: Joi.number().positive().required(),
        }),
        body: Joi.object({
            data: Joi.object({
                year: Joi.number().integer().optional(),
                price: Joi.number().min(0).optional(),
                vin: Joi.string().alphanum().length(17).optional(),
                modelId: Joi.number().optional(),
                makeId: Joi.number().optional()
            }).required()
        }),
    },

    deleteCarSchema: {
        params: Joi.object({
            userId: Joi.number().positive().required(),
            id: Joi.number().positive().required(),
        }),
    },

    getUserCarByIdSchema: {
        params: Joi.object({
            userId: Joi.number().positive().required(),
            id: Joi.number().positive().required(),
        }),
    },

    deleteUserSchema: {
        params: Joi.object({
            id: Joi.number().positive().required(),
        }),
    },

    getUsersCarsListSchema: {
        params: Joi.object({
            userId: Joi.number().positive().required(),
        }),
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            pageSize: Joi.number().integer().min(1).default(10)
        }),
    },

    getModelsByMakeIdSchema: {
        params: Joi.object({
            id: Joi.number().positive().required(),
        }),
    },
};
