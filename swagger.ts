const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Koa API",
        description: "API documentation for user authentication and management.",
        version: "1.0.0",
    },
    paths: {
        "/sign-up": {
            post: {
                summary: "Register a new user",
                description: "Creates a new user with an email and password",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                        description: "The user's email address",
                                    },
                                    password: {
                                        type: "string",
                                        description: "The user's password",
                                    },
                                },
                                required: ["email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "User successfully created",
                    },
                    409: {
                        description: "Email already in use",
                    },
                },
            },
        },
        "/sign-in": {
            post: {
                summary: "Authenticate user",
                description: "Logs in a user with email and password, returns access and refresh tokens",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                        description: "The user's email address",
                                    },
                                    password: {
                                        type: "string",
                                        description: "The user's password",
                                    },
                                },
                                required: ["email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Successful login, tokens returned",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        accessToken: {
                                            type: "string",
                                            description: "Access token for the authenticated user",
                                        },
                                        refreshToken: {
                                            type: "string",
                                            description: "Refresh token for the authenticated user",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    404: {
                        description: "User not found",
                    },
                    401: {
                        description: "Invalid password",
                    },
                },
            },
        },
        "/users": {
            get: {
                summary: "Get a list of users",
                description: "Returns a paginated list of users",
                parameters: [
                    {
                        in: "query",
                        name: "page",
                        required: false,
                        schema: {
                            type: "integer",
                            description: "The page number for pagination",
                        },
                    },
                    {
                        in: "query",
                        name: "pageSize",
                        required: false,
                        schema: {
                            type: "integer",
                            description: "The number of users per page",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "A list of users with pagination",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        users: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: {
                                                        type: "integer",
                                                    },
                                                    email: {
                                                        type: "string",
                                                    },
                                                    createdAt: {
                                                        type: "string",
                                                        format: "date-time",
                                                    },
                                                },
                                            },
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                currentPage: {
                                                    type: "integer",
                                                },
                                                pageSize: {
                                                    type: "integer",
                                                },
                                                totalUsers: {
                                                    type: "integer",
                                                },
                                                totalPages: {
                                                    type: "integer",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default swaggerSpec;


