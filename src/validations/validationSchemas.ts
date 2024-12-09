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
        body: Joi.object({
            year: Joi.number().integer().required(),
            price: Joi.number().min(0).required(),
            vin: Joi.string().alphanum().length(17).required(),
            modelId: Joi.number().required(),
            makeId: Joi.number().required(),
            userId: Joi.number().optional(),
        }),
    },

    editCarSchema: {
        params: Joi.object({
            id: Joi.number().required(),
        }),
        body: Joi.object({
            data: Joi.object({
                year: Joi.number().integer().optional(),
                price: Joi.number().min(0).optional(),
                vin: Joi.string().alphanum().length(17).optional(),
                modelId: Joi.number().optional(),
                makeId: Joi.number().optional(),
                userId: Joi.number().optional(),
            }).required()
        }),
    },

    deleteCarSchema: {
        params: Joi.object({
            id: Joi.number().required(),
        }),
    },

    getUserCarByIdSchema: {
        body: Joi.object({
            id: Joi.number().required(),
        }),
    },

    deleteUserSchema: {
        params: Joi.object({
            id: Joi.number().required(),
        }),
    },


    getCarsListSchema: {
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            pageSize: Joi.number().integer().min(1).default(10)
        }),
    },
};
