export enum ErrorStatus {
    ValidationError = 'VALIDATION_ERROR',
    NotFound = 'NOT_FOUND',
    Unauthorized = 'UNAUTHORIZED',
    InternalError = 'INTERNAL_SERVER_ERROR',
}

interface ErrorCause {
    errors: Error[];
    details: string[];
}

export class CustomError extends Error {
    statusCode: number;
    status: ErrorStatus;
    cause: ErrorCause;

    constructor(messageOrError?: string | Error, statusCode: number = 500, status: ErrorStatus = ErrorStatus.InternalError, details: string | string[] = '') {
        let message: string;
        let causeErrors: Error[] = [];
        let causeDetails: string[] = Array.isArray(details) ? details : details ? [details] : [];

        if (typeof messageOrError === 'string') {
            message = messageOrError;
        } else if (messageOrError instanceof Error) {
            message = messageOrError.message;
            causeErrors = [messageOrError];
            if (causeDetails.length === 0) {
                causeDetails = [message];
            }
        } else {
            message = '';
        }

        super(message);

        this.cause = {
            errors: causeErrors,
            details: causeDetails,
        };

        this.statusCode = statusCode;
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends CustomError {
    constructor(messageOrError?: string | Error, details: string | string[] = '') {
        super(messageOrError, 400, ErrorStatus.ValidationError, details);
    }
}

export class NotFoundError extends CustomError {
    constructor(messageOrError?: string | Error, details: string | string[] = '') {
        super(messageOrError, 404, ErrorStatus.NotFound, details);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(messageOrError?: string | Error, details: string | string[] = '') {
        super(messageOrError, 401, ErrorStatus.Unauthorized, details);
    }
}

export class InternalError extends CustomError {
    constructor(messageOrError?: string | Error, details: string | string[] = '') {
        super(messageOrError, 500, ErrorStatus.InternalError, details);
    }
}


interface DatabaseErrorData {
    message: string;
    details: string | string[];
}

export class DatabaseError extends CustomError {
    constructor(messageOrError?: string | Error, details: string | string[] = '') {
        super(
            messageOrError || 'An unexpected database error occurred',
            500,
            ErrorStatus.InternalError,
            ''
        );
    }
}

export class DatabaseErrorFactory {
    static createErrorData(error: any, defaultMessage: string): DatabaseErrorData {
        const errorMessages: Record<string, string> = {
            'P2002': 'A unique constraint violation occurred.',
            'P2025': 'The requested record was not found.',
        };

        const safeMessage = error?.code ? errorMessages[error.code] || defaultMessage : defaultMessage;
        const errorDetails = error.message || 'No additional details';

        return { message: safeMessage, details: errorDetails };
    }

    static from(errorData: DatabaseErrorData): DatabaseError {
        return new DatabaseError(errorData.message, errorData.details);
    }
}

