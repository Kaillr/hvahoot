import { RequestHandler } from 'express';
import { hash } from '@node-rs/argon2';
import db from '../config/db.js';
import { v4 as uuidv4, validate as validateuuid } from 'uuid';
import paginate from '../helpers/paginate.js';
import sendResponse from '../helpers/sendResponse.js';

export const getAllUsers: RequestHandler = async (req, res, next) => {
    try {
        const { data, pagination, error } = await paginate({
            req,
            table: 'users',
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
            message: 'Users fetched successfully.',
            data: { users: data },
            pagination: pagination,
        });
    } catch (err) {
        next(err);
    }
};

export const getUserById: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    if (!validateuuid(id)) {
        sendResponse({
            req,
            res,
            statusCode: 400,
            error: {
                code: 'INVALID_PARAMETERS',
                message: 'Invalid user id.',
                details: 'User id must be a valid UUID.',
            },
        });
        return;
    }

    try {
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [
            id,
        ]);

        if (rows.length === 0) {
            sendResponse({
                req,
                res,
                statusCode: 404,
                error: {
                    code: 'NOT_FOUND',
                    message: 'User not found.',
                    details: 'User with the provided id does not exist.',
                },
            });
            return;
        }
        const user = rows[0];

        sendResponse({
            req,
            res,
            statusCode: 200,
            message: 'User fetched successfully.',
            data: { user: user },
        });
    } catch (err) {
        next(err);
    }
};

export const createNewUser: RequestHandler = async (
    req,
    res,
    next,
): Promise<void> => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return sendResponse({
            req,
            res,
            statusCode: 400,
            error: {
                code: 'BAD_REQUEST',
                message: 'Missing email, username, or password.',
                details: 'Make sure all required fields are provided.',
            },
        });
    }

    const id = uuidv4();

    try {
        const hashedPassword = await hash(password);

        const { rowCount: emailInUse } = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email],
        );

        const { rowCount: usernameInUse } = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username],
        );

        if (emailInUse) {
            sendResponse({
                req,
                res,
                statusCode: 400,
                error: {
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'Email is already in use.',
                },
            });
            return;
        }

        if (usernameInUse) {
            sendResponse({
                req,
                res,
                statusCode: 400,
                error: {
                    code: 'USERNAME_ALREADY_EXISTS',
                    message: 'Username is already in use.',
                },
            });
            return;
        }

        await db.query(
            'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)',
            [id, username, email, hashedPassword],
        );

        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [
            id,
        ]);
        const user = rows[0];

        sendResponse({
            req,
            res,
            statusCode: 201,
            message: 'User registered successfully.',
            data: { user: user },
        });
    } catch (err) {
        next(err);
    }
};
