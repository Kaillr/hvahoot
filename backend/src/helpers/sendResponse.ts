import { Request, Response } from 'express';
import { ErrorDetails } from '../types/error.js';
import { Pagination } from '../types/pagination.js';

interface ResponseParams {
    req: Request;
    res: Response;
    statusCode: number;
    message?: string;
    error?: ErrorDetails;
    data?: object;
    pagination?: Pagination;
}

interface ResponsePayload {
    status: string;
    message: string;
    error: ErrorDetails;
    data: object;
    meta: {
        pagination: Pagination;
        timestamp: string;
        path: string;
    };
}

export default function sendResponse({
    req,
    res,
    statusCode,
    message,
    error,
    data,
    pagination,
}: ResponseParams): void {
    let statusMessage: string;

    if (statusCode < 400) {
        statusMessage = 'success';
    } else if (statusCode < 500) {
        statusMessage = 'fail';
    } else {
        statusMessage = 'error';
    }

    res.status(statusCode).json({
        status: statusMessage,
        message: message,
        error: error,
        data: data,
        meta: {
            pagination: pagination,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
        },
    } as ResponsePayload);
}
