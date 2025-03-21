import { ErrorRequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import sendResponse from '../helpers/sendResponse.js';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const traceId = uuidv4();

    console.error(err);

    if (!res.headersSent) {
        sendResponse({
            req,
            res,
            statusCode: 500,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error.',
                trace_id: traceId,
            },
        });
    } else {
        next(err);
    }
};

export default errorHandler;
