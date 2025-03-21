import { RequestHandler } from 'express';
import { getQuizData } from '../services/quizService.js';
import sendResponse from '../helpers/sendResponse.js';
import { validate as validateuuid } from 'uuid';
import paginate from '../helpers/paginate.js';

export const getAllQuizzes: RequestHandler = async (req, res, next) => {
    try {
        const { data, pagination, error } = await paginate({
            req,
            table: 'quizzes',
        });

        if (error) {
            sendResponse({
                req,
                res,
                statusCode: 400,
                error: error,
            });
            return;
        }

        sendResponse({
            req,
            res,
            statusCode: 200,
            message: 'Quizzes fetched successfully.',
            data: { quizzes: data },
            pagination: pagination,
        });
    } catch (err) {
        next(err);
    }
};

export const getQuizById: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    if (!validateuuid(id)) {
        sendResponse({
            req,
            res,
            statusCode: 400,
            error: {
                code: 'INVALID_PARAMETERS',
                message: 'Invalid quiz id.',
                details: 'Quiz id must be a valid UUID.',
            },
        });
        return;
    }

    try {
        const quizData = await getQuizData(id);

        if (!quizData) {
            sendResponse({
                req,
                res,
                statusCode: 404,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Quiz not found.',
                    details: 'Quiz with the provided id does not exist.',
                },
            });
            return;
        }

        sendResponse({
            req,
            res,
            statusCode: 200,
            message: 'Quiz fetched successfully.',
            data: { quiz: quizData },
        });
    } catch (err) {
        next(err);
    }
};
