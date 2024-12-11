export interface SignUpRequest {
    fullName: string;
    phone?: string;
    email: string;
    password: string;
    role?: string;
}

export interface CreateCarRequest {
    year: number;
    price: number;
    vin: string;
    modelId: number;
    makeId: number;
    userId?: number;
}

export interface EditCarRequest {
    id: number;
    data: {
        year?: number;
        price?: number;
        vin?: string;
        modelId?: number;
        makeId?: number;
    }
}

export interface DeleteCarRequest {
    id: number;
}

export interface GetUserCarByIdRequest {
    id: number;
}

export enum Roles {
    User = "user",
    Admin = "admin"
}