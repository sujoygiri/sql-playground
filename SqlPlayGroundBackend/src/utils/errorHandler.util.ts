import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    status?: number;
    details?: Record<string, any> | string | null;

    constructor(
        message: string,
        status?: number,
        details?: Record<string, any> | string | null
    ) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.details = details;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

// Error handler middleware
export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Default values
    const statusCode = err.status ?? 500;
    const errorResponse = {
        success: false,
        name: err.name ?? 'Error',
        message: err.message || 'Internal Server Error',
        details: err.details ?? null,
    };

    // Log error (customize as needed)
    if (process.env.NODE_ENV === 'development') {
        errorResponse['stack'] = err.stack
        console.error(`[${new Date().toISOString()}]`, err);
    }

    res.status(statusCode).json(errorResponse);
}
